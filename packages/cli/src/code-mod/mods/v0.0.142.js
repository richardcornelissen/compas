// @ts-nocheck

import { readFile, writeFile } from "fs/promises";
import {
  AppError,
  eventStart,
  eventStop,
  isNil,
  newEventFromEvent,
  processDirectoryRecursive,
} from "@compas/stdlib";
import * as recast from "recast";
import { PARALLEL_COUNT } from "../constants.js";

/**
 * Convert useQueryFoo({}, {}, { staleTime: 5 }) to useQueryFoo({ params: {}, body: {},
 * options: { staleTime: 5 } })
 *
 * @param {InsightEvent} event
 * @param {boolean} verbose
 * @returns {Promise<void>}
 */
export async function executeCodeModVZeroDotZeroDotHundredFortyTwo(
  event,
  verbose,
) {
  const generatedFileList = await listGeneratedReactQueryFiles(
    newEventFromEvent(event),
  );

  if (verbose) {
    event.log.info({
      message: `Found ${generatedFileList.length} generated reactQueries.tsx files.`,
    });
  }

  const collectedGeneratedReactQueryHooks =
    await collectGeneratedReactQueryHooks(newEventFromEvent(event), [
      ...generatedFileList,
    ]);

  if (verbose) {
    event.log.info({
      message: `Found ${
        Object.keys(collectedGeneratedReactQueryHooks).length
      } 'useQuery' hooks in generated files.`,
    });
  }

  const fullFileList = await listAllTypeScriptFiles(
    newEventFromEvent(event),
    generatedFileList,
  );

  if (verbose) {
    event.log.info({
      message: `Found ${fullFileList.length} ts(x) files in this project.`,
    });
  }

  if (verbose) {
    event.log.info({
      message: `Code-modding the found files, processing ${PARALLEL_COUNT} files in parallel.`,
    });
  }

  const { callCount, fileCount } = await modTheFiles(
    newEventFromEvent(event),
    collectedGeneratedReactQueryHooks,
    [...fullFileList],
  );

  if (verbose) {
    event.log.info({
      message: `Replaced ${callCount} call-sites of ${
        Object.keys(collectedGeneratedReactQueryHooks).length
      } generated functions over ${fileCount} out of ${
        fullFileList.length
      } known files.`,
    });
  }
}

/**
 * Find generated reactQueries.tsx files
 *
 * @param {InsightEvent} event
 * @returns {Promise<string[]>}
 */
async function listGeneratedReactQueryFiles(event) {
  eventStart(event, "v00142.listGeneratedReactQueryFiles");

  const possibleFileList = [];

  await processDirectoryRecursive(process.cwd(), (file) => {
    if (file.endsWith("reactQueries.tsx")) {
      possibleFileList.push(file);
    }
  });

  const result = [];

  while (possibleFileList.length) {
    const partial = possibleFileList.splice(0, PARALLEL_COUNT);

    await Promise.all(
      partial.map(async (file) => {
        const contents = await readFile(file, "utf-8");

        if (contents.startsWith("// Generated by @compas/code-gen")) {
          result.push(file);
        }
      }),
    );
  }

  eventStop(event);

  return result;
}

/**
 * Parse the reactQueries.tsx files and collect the hooks based on 'useXxxXxx'
 *
 * @param {InsightEvent} event
 * @param {string[]} fileList
 * @returns {Promise<Record<string, {parameters: string[]}>>}
 */
async function collectGeneratedReactQueryHooks(event, fileList) {
  eventStart(event, "v00142.collectGeneratedReactQueryHooks");

  const result = {};

  while (fileList.length) {
    const partial = fileList.splice(0, PARALLEL_COUNT);

    await Promise.all(
      partial.map(async (file) => {
        const contents = await readFile(file, "utf-8");

        const ast = await parseFile(file, contents);

        const nodes = ast.program.body
          .filter((it) => it.type === "ExportNamedDeclaration")
          .map((it) => it.declaration)
          .filter((it) => it.type === "FunctionDeclaration");

        for (const node of nodes) {
          if (node.body.body.length === 2) {
            // const api = useApi();
            // return useMutation();
            continue;
          }

          result[node.id.name] = {
            parameters: node.params
              .map((it) => {
                if (it.type === "Identifier") {
                  return it.name;
                } else if (it.type === "AssignmentPattern") {
                  // options = {}, ie a default value
                  return it.left.name;
                }
              })
              .filter((it) => !isNil(it)),
          };

          if (result[node.id.name].parameters.length === 0) {
            delete result[node.id.name];
          }
        }
      }),
    );
  }

  eventStop(event);

  return result;
}

/**
 * Find all ts(x) files, excluding the generated ones
 *
 * @param {InsightEvent} event
 * @param {string[]} generatedFiles
 * @returns {Promise<string[]>}
 */
async function listAllTypeScriptFiles(event, generatedFiles) {
  eventStart(event, "v00142.listAllTypeScriptFiles");

  const result = [];

  await processDirectoryRecursive(process.cwd(), (file) => {
    if (file.endsWith(".d.ts")) {
      return;
    }

    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) {
      return;
    }

    if (generatedFiles.includes(file)) {
      return;
    }

    result.push(file);
  });

  eventStop(event);

  return result;
}

/**
 * Replace the call-sites
 *
 * @param {InsightEvent} event
 * @param {Object<string, { parameters: string[], }>} knownHooks
 * @param {string[]} fileList
 * @returns {Promise<{ callCount: number, fileCount: number }>}
 */
async function modTheFiles(event, knownHooks, fileList) {
  eventStart(event, "v00142.modTheFiles");

  const builders = recast.types.builders;

  let replaceCount = 0;
  let modifiedFileCount = 0;

  while (fileList.length) {
    const partial = fileList.splice(0, PARALLEL_COUNT);

    await Promise.all(
      partial.map(async (file) => {
        let didReplace = false;
        const contents = await readFile(file, "utf-8");

        const ast = await parseFile(file, contents);

        recast.visit(ast, {
          visitCallExpression(path) {
            if (
              isNil(path.node?.callee?.name) ||
              isNil(knownHooks[path.node?.callee?.name])
            ) {
              this.traverse(path);
            } else {
              replaceCount++;
              didReplace = true;

              const args = path.node.arguments;
              const { parameters } = knownHooks[path.node.callee.name];
              path.node.arguments = [
                builders.objectExpression(
                  parameters
                    .map((it, idx) => {
                      if (isNil(args[idx])) {
                        return undefined;
                      }

                      return builders.objectProperty(
                        builders.identifier(it),
                        args[idx],
                      );
                    })
                    .filter((it) => !!it),
                ),
              ];
              this.traverse(path);
            }
          },
        });

        if (didReplace) {
          modifiedFileCount++;
          await writeFile(file, recast.print(ast).code, "utf-8");
        }
      }),
    );
  }

  eventStop(event);

  return {
    callCount: replaceCount,
    fileCount: modifiedFileCount,
  };
}

/**
 * Parse a file, enabling typescript and jsx parsers when necessary
 *
 * @param {string} file
 * @param {string} contents
 * @returns {Promise<File|any>}
 */
async function parseFile(file, contents) {
  let babel;

  try {
    babel = await import("@babel/parser");
  } catch (e) {
    throw new AppError("cli.codeMod.failedToLoadBabel", 500, {
      message: "Please install @compas/lint-config, or @babel/parser directly.",
    });
  }

  const babelOpts = await import("recast/parsers/_babel_options.js");
  const opts = babelOpts.default.default();

  try {
    return recast.parse(contents, {
      parser: {
        parse(code) {
          if (file.endsWith(".ts")) {
            opts.plugins.push("typescript");
          } else if (file.endsWith(".tsx")) {
            opts.plugins.push("jsx", "typescript");
          } else if (file.endsWith(".jsx")) {
            opts.plugins.push("jsx");
          }

          return babel.parse(code, opts);
        },
      },
    });
  } catch (e) {
    throw new AppError(
      "cli.codeMod.failedToParseFile",
      500,
      {
        file,
      },
      e,
    );
  }
}

// @ts-nocheck

import { createHash } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { readFile } from "fs/promises";
import { pathToFileURL } from "url";
import {
  AppError,
  dirnameForModule,
  isNil,
  pathJoin,
  spawn,
  uuid,
} from "@compas/stdlib";
import { formatGraphOfSql } from "../../visualise/sql.js";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "visualise",
  shortDescription: "Visualise various code-generated structures.",
  modifiers: {
    isCosmetic: true,
  },
  subCommands: [
    {
      name: "erd",
      shortDescription:
        "Visualise entity structure and relations in a diagram.",
      flags: [
        {
          name: "generatedOutputDirectory",
          rawName: "--generated-directory",
          description: "The directory containing the generated files.",
          modifiers: {
            isRequired: true,
          },
          value: {
            specification: "string",
            validator: (value) => {
              const isValid = existsSync(
                pathJoin(value, "common/structure.js"),
              );

              if (isValid) {
                return {
                  isValid,
                };
              }

              return {
                isValid,
                error: {
                  message: `The specified directory does not have a 'common/structure.js'. Did you enable 'dumpStructure' when generating?`,
                },
              };
            },
            completions: () => {
              return {
                completions: [{ type: "directory" }],
              };
            },
          },
        },
        {
          name: "format",
          rawName: "--format",
          description:
            "Output file format. Supports png, webp, pdf and svg. Defaults to svg.",
          value: {
            specification: "string",
            validator: (value) => {
              const isValid = ["png", "webp", "pdf", "svg"].includes(value);

              if (isValid) {
                return {
                  isValid,
                };
              }

              return {
                isValid,
                error: {
                  message:
                    "Supported formats are 'png', 'webp', 'pdf' and 'svg'.",
                },
              };
            },
            completions: () => {
              return {
                completions: [
                  { type: "completion", name: "png" },
                  { type: "completion", name: "webp" },
                  { type: "completion", name: "pdf" },
                  { type: "completion", name: "svg" },
                ],
              };
            },
          },
        },
        {
          name: "outputFile",
          rawName: "--output",
          description:
            "Path to write the output to. Defaults to a random temporary file.",
          value: {
            specification: "string",
            completions: () => ({ completions: [{ type: "file" }] }),
          },
        },
      ],
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  // Assumes that command is always ERD, since 'modifiers.isCosmetic' on
  // 'visualise'.

  const resolvedStructureFile = pathJoin(
    process.cwd(),
    state.flags.generatedOutputDirectory,
    "common/structure.js",
  );

  const codeGen = await getCodeGenExports();
  if (!codeGen) {
    logger.error(
      `The visualiser needs @compas/code-gen to run. Please install it with 'yarn add --exact --dev @compas/code-gen' or 'npm add --save-exact --save-dev @compas/code-gen'.`,
    );

    return {
      exitStatus: "failed",
    };
  }

  if (!existsSync(resolvedStructureFile)) {
    logger.error(
      `The specified generated directory ('${state.flags.generatedOutputDirectory}') does not have a 'common/structure.js'. Did you enable 'dumpStructure' when generating?`,
    );

    return {
      exitStatus: "failed",
    };
  }

  if (!(await structureFileExportsStructure(resolvedStructureFile, codeGen))) {
    logger.error(
      `The specified generated directory '${state.flags.generatedOutputDirectory}' does not export a valid structure. Did you enable 'dumpStructure' when generating?`,
    );

    return {
      exitStatus: "failed",
    };
  }

  const outputFormat = state.flags.format ?? "svg";
  if (!["svg", "png", "webp", "pdf"].includes(outputFormat)) {
    logger.error(
      `Invalid '--format' ('${state.flags.format}'). Please use one of 'png', 'svg', 'webp' or 'pdf'.`,
    );

    return {
      exitStatus: "failed",
    };
  }

  const outputFile = state.flags.outputFile ?? `/tmp/${uuid()}.${outputFormat}`;

  // Get the structure
  const { structure } =
    (await getStructure(logger, codeGen, resolvedStructureFile)) ?? {}; // @ts-ignore
  if (!structure) {
    logger.error(
      `The structure file could not be loaded. Please ensure that 'dumpStructure' options is enabled while generating.`,
    );
    return {
      exitStatus: "failed",
    };
  }

  // Execute and write

  let graph = formatGraphOfSql(codeGen, structure);

  const label = "Entity Relation Diagram generated by Compas.\nHash: ";
  const searchString = `"label"`;

  // @ts-ignore
  const hash = createHash("sha256").update(graph).digest("hex").substr(0, 8);

  // Add hash to output, this way we prevent large svg diffs caused by different Graphviz
  // versions @ts-ignore
  const [start, ...end] = graph.split(searchString);
  graph = `${start}"${label}${hash}"${end.join(searchString)}`;

  if (existsSync(outputFile) && outputFormat === "svg") {
    const existingContents = await readFile(outputFile, "utf-8");
    const existingHash =
      (existingContents ?? "").split("Hash: ")?.[1]?.substr(0, 8) ?? "";

    if (existingHash === hash) {
      logger.info(
        "Generated Dot file is the same as the existing output. Skipping output.",
      );

      logger.info(`Graph of 'erd' is available at ${outputFile}`);
      return {
        exitStatus: "passed",
      };
    }
  }

  // Graphviz / Dot does not create the directory if it doesn't exists.
  // So make sure to do that here.
  const outputDir = outputFile.split("/").slice(0, -1).join("/");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const tmpPathDot = `/tmp/${uuid()}.gv`;

  writeFileSync(tmpPathDot, graph, "utf8");

  logger.info(`Dot file written to temporary directory. Spawning 'dot'.`);
  try {
    const { exitCode } = await spawn(`dot`, [
      `-T${outputFormat}`,
      `-o`,
      outputFile,
      tmpPathDot,
    ]);

    if (exitCode !== 0) {
      logger.error(
        "'Dot' returned with an error. Please check the above output.",
      );
      return { exitStatus: "failed" };
    }
  } catch {
    logger.error(
      `'Dot' could not be found. Please install 'graphviz' via your package manager and try again.`,
    );
    return { exitStatus: "failed" };
  }

  logger.info(`Graph of 'erd' is available at ${outputFile}`);
  return {
    exitStatus: "passed",
  };
}

/**
 * Check if the code-gen 'internal-exports' file can be imported and import it
 */
async function getCodeGenExports() {
  const codeGenImportPath = pathJoin(
    dirnameForModule(import.meta),
    "../../../../code-gen/src/internal-exports.js",
  );

  if (!existsSync(codeGenImportPath)) {
    return undefined;
  }

  try {
    // @ts-ignore
    return await import(pathToFileURL(codeGenImportPath));
  } catch {
    return undefined;
  }
}

/**
 * Check if the exported structure conforms to the Compas structure
 *
 * @param structureFile
 * @param codeGen
 * @returns {Promise<boolean>}
 */
async function structureFileExportsStructure(structureFile, codeGen) {
  let structure;
  try {
    // @ts-ignore
    const imported = await import(pathToFileURL(structureFile));
    if (isNil(imported?.structure)) {
      return false;
    }
    structure = imported.structure;
  } catch {
    return false;
  }

  const { error } = codeGen.validateCodeGenStructure(structure);
  if (error) {
    throw error;
  }

  return true;
}

/**
 * Get the structure using @compas/code-gen internal functions. This ensures all
 * references are linked and the structure is valid.
 *
 * @param {Logger} logger
 * @param codeGen
 * @param {string} structureFile
 * @returns {Promise<{structure: CodeGenStructure}|undefined>}
 */
async function getStructure(logger, codeGen, structureFile) {
  // @ts-ignore
  const { structure } = await import(pathToFileURL(structureFile));

  const context = {
    structure,
    logger,
    errors: [],
    options: {
      enabledGenerators: ["sql", "validator"],
    },
  };

  try {
    codeGen.preprocessorsExecute(context);
    codeGen.addFieldsOfRelations(context);
    codeGen.doSqlChecks(context);
    codeGen.exitOnErrorsOrReturn(context);

    return {
      structure: context.structure,
    };
  } catch (/** @type {any} */ e) {
    if (AppError.instanceOf(e)) {
      logger.error(AppError.format(e));
    } else if (e.message) {
      logger.error(e);
    }
    return undefined;
  }
}

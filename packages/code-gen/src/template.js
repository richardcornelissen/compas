import { readFileSync } from "fs";
import path from "path";
import {
  AppError,
  camelToSnakeCase,
  isNil,
  processDirectoryRecursiveSync,
} from "@compas/stdlib";
import { formatDocString } from "./generator/comments.js";
import { lowerCaseFirst, upperCaseFirst } from "./utils.js";

/**
 * @type {{context: Record<string, Function>, globals: Record<string, Function>}}
 */
export const templateContext = {
  globals: {
    isNil,
    upperCaseFirst,
    lowerCaseFirst,
    camelToSnakeCase,
    quote: (x) => `"${x}"`,
    formatDocString,
  },
  context: {},
};

/**
 * @param {string} name
 * @param {string} str
 * @param {{ debug?: boolean }} [opts={}]
 */
export function compileTemplate(name, str, opts = {}) {
  if (isNil(name) || isNil(str)) {
    throw new TypeError("Both name and string are required");
  }

  const compiled = str
    .split("\n")
    .map((it) => {
      const cleaned = it.replace(/[\r\n\t]/g, " ");
      const markStarts = cleaned.split("{{").join("\t");
      const evaluate = markStarts
        .replace(/((^|}})[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)}}/g, "',$1,'");

      // Syntax fixes, e.g start new push when necessary
      return evaluate
        .split("\t")
        .join("');")
        .split("}}")
        .join("p.push('")
        .split("\r")
        .join("\\'");
    })
    .join("\\n");

  const debugString = opts.debug
    ? "console.dir({ contextKeys: Object.keys(_ctx), data: it }, {colors: true, depth: null});"
    : "";

  try {
    templateContext.context[name] = new Function(
      "_ctx",
      "it",
      `
    const p = [];
    ${debugString}
    with (_ctx) { with (it) {
    p.push('${compiled}');
    }}
    
    return p.join('')
      .replace(/[ \\t\\r]+/g, ' ') // Replace all multiple spaces, with a single
      .replace(/^[ \\t\\r]+/gm, '') // Replace spaces at start of sentence with nothing
      .replace(/^(\\s*\\r?\\n){1,}/gm, '\\n') // Replace multiple new lines
      .replace(/^\\s*\\*\\s*([^\\n\\/\\*]+)\\s*\\n+/gm, ' * $1\\n') // Reformat lines in JSDoc
      .replace(/\\n\\n/gm, '\\n') // Remove empty lines
      .replace(/\\(\\(newline\\)\\)/g, '\\n\\n'); // Controlled newlines 
  `,
    );
  } catch (e) {
    throw AppError.serverError(
      {
        message: `Error while compiling template`,
        templateName: name,
        compiled,
      },
      // @ts-ignore
      e,
    );
  }
}

/**
 * @param {string} dir
 * @param {string} extension
 * @param {import("@compas/stdlib").ProcessDirectoryOptions} [opts]
 */
export function compileTemplateDirectory(dir, extension, opts) {
  const ext = extension[0] !== "." ? `.${extension}` : extension;
  processDirectoryRecursiveSync(
    dir,
    (file) => {
      if (!file.endsWith(ext)) {
        return;
      }

      const content = readFileSync(file, "utf-8");
      const name = path.parse(file).name;

      compileTemplate(name, content);
    },
    opts,
  );
}

/**
 * @param {string} name
 * @param {*} data
 * @returns {string}
 */
export function executeTemplate(name, data) {
  if (isNil(templateContext)) {
    throw new TypeError(
      "TemplateContext is required, please create a new one with `newTemplateContext()`",
    );
  }

  if (isNil(templateContext.context[name])) {
    throw new Error(`Unknown template: ${name}`);
  }

  try {
    return templateContext.context[name](getExecutionContext(), data).trim();
  } catch (/** @type {any} */ e) {
    throw new AppError(
      "codeGen.executeTemplate.error",
      500,
      {
        message: "Error while executing template",
        template: name,
      },
      e,
    );
  }
}

/**
 * Combine globals and registered templates into a single object
 */
function getExecutionContext() {
  const result = {
    ...templateContext.globals,
  };
  for (const [key, item] of Object.entries(templateContext.context)) {
    result[key] = item.bind(undefined, result);
  }

  return result;
}

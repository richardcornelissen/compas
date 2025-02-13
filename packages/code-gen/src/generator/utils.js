import { isNil } from "@compas/stdlib";

/**
 * @typedef {{
 *   print: (() => string),
 *   destructureImport: ((value: string, pkg: string) => void),
 *   starImport: ((alias: string, pkg: string) => void),
 *   commonjsImport: ((alias: string, pkg: string) => void),
 *   rawImport: ((value: string) => void),
 * }} ImportCreator
 */

/**
 * Clean template output by removing redundant new lines
 *
 * @param {string} str
 * @returns {string}
 */
export function cleanTemplateOutput(str) {
  return str
    .split("\n")
    .map((it) => it.trim())
    .filter((it) => it.length > 0)
    .join("\n")
    .replace(/^(\s*\*\s*\n)+/gm, " *\n") // replace empty lines in JSDoc (i.e. line is with ` *`)
    .replace(/^(\s*\*.*\n)\s*\n/gm, "$1") // Strip empty new lines after a doc line
    .replace(/^\/\*\*\s*(\n\s*\*\s*(?=\n))+$/gm, "/**\n") // Strip empty lines at the start of a doc block
    .replace(/(\n){3,}/gm, "\n\n"); // Remove too much empty lines
}

/**
 * Manage imports for a file
 *
 * @returns {ImportCreator}
 */
export function importCreator() {
  const state = {
    destructureImport: {},
    starImport: new Map(),
    commonjsImport: new Map(),
    rawImports: new Set(),
  };

  return {
    destructureImport: (value, pkg) => {
      if (isNil(state.destructureImport[pkg])) {
        state.destructureImport[pkg] = new Set();
      }

      state.destructureImport[pkg].add(value);
    },

    starImport: (alias, pkg) => {
      state.starImport.set(pkg, alias);
    },

    commonjsImport: (alias, pkg) => {
      state.commonjsImport.set(pkg, alias);
    },

    rawImport: (value) => {
      state.rawImports.add(value);
    },

    print: () => {
      const result = [];

      for (const [key, value] of state.commonjsImport.entries()) {
        result.push(`import ${value} from "${key}";`);
      }

      for (const [key, value] of state.starImport.entries()) {
        result.push(`import * as ${value} from "${key}";`);
      }

      // Sort based on imported file name
      // At some point a hard to reproduce / unverifiable bug in eslint-plugin import
      // popups up, which results in a non auto-fixable import sort. By sorting this pre
      // writing, we prevent the issue all together.
      for (const key of Object.keys(state.destructureImport).sort()) {
        const joinString =
          state.destructureImport[key].size > 3 ? ",\n  " : ", ";
        result.push(
          `import { ${[...state.destructureImport[key].values()]
            .sort()
            .join(joinString)} } from "${key}";`,
        );
      }

      result.push(...state.rawImports);

      return result.join("\n");
    },
  };
}

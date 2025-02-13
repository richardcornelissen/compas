import { environment, spawn } from "@compas/stdlib";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "lint",
  shortDescription: "Lint all project files.",
  longDescription: `Uses Prettier and ESLint to lint project files.
  
ESLint is used for all JavaScript files and Prettier runs on JavaScript, JSON, Markdown, and YAML files.
The default configuration can be initialized via 'compas init --lint-config'.
`,
  flags: [
    {
      name: "skipPrettier",
      rawName: "--skip-prettier",
      description: "Skip running Prettier.",
    },
    {
      name: "skipEslint",
      rawName: "--skip-eslint",
      description: "Skip running ESLint.",
    },
    {
      name: "eslintCacheLocation",
      rawName: "--eslint-cache-location",
      description:
        "Location of ESLint cache directory. Defaults to '.cache/eslint/'.",
      value: {
        specification: "string",
        completions: () => ({
          completions: [{ type: "directory" }],
        }),
      },
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
  let exitCode = 0;

  if (state.flags.skipEslint !== true) {
    logger.info("Running ESLint...");

    /** @type {string} */
    // @ts-ignore
    const cacheLocation = state.flags.eslintCacheLocation ?? "./.cache/eslint/";

    const { exitCode: lint } = await spawn("npx", [
      "eslint",
      "./**/*.js",
      ...(environment.CI === "true" ? [] : ["--fix"]),
      "--no-error-on-unmatched-pattern",
      "--cache",
      "--cache-strategy",
      "content",
      "--cache-location",
      cacheLocation,
    ]);

    exitCode = lint;
  }

  if (state.flags.skipPrettier !== true) {
    logger.info("Running Prettier...");

    const prettierCommand =
      environment.CI === "true" ? ["--check"] : ["--write", "--list-different"];

    const { exitCode: pretty } = await spawn("npx", [
      "prettier",
      ...prettierCommand,
      "--ignore-unknown",
      "--no-error-on-unmatched-pattern",
      ".",
    ]);

    exitCode = exitCode === 0 ? pretty : exitCode;
  }

  if (exitCode !== 0) {
    return {
      exitStatus: "failed",
    };
  }

  return {
    exitStatus: "passed",
  };
}

import { existsSync } from "fs";
import {
  isNil,
  merge,
  newLogger,
  pathJoin,
  printProcessMemoryUsage,
} from "@compas/stdlib";
import { ReferenceType } from "./builders/ReferenceType.js";
import { buildOrInfer } from "./builders/utils.js";
import { generateTypes } from "./generate-types.js";
import {
  addGroupsToGeneratorInput,
  addToData,
  hoistNamedItems,
} from "./generate.js";
import {
  validateCodeGenStructure,
  validateCodeGenType,
} from "./generated/codeGen/validators.js";
import { generate } from "./generator/index.js";
import { generateOpenApi } from "./generator/openAPI/index.js";
import { getInternalRoutes } from "./generator/router/index.js";
import { recursivelyRemoveInternalFields } from "./internal.js";
import { loadFromOpenAPISpec } from "./loaders.js";
import { lowerCaseFirst } from "./utils.js";

/**
 * @typedef {object} GenerateOpts
 * @property {string[]|undefined} [enabledGroups] Enabling specific groups so different
 *    generator combinations can be used. The machinery will automatically find
 *    referenced types and include those If this is undefined, all groups will be
 *    enabled.
 * @property {boolean|undefined} [isBrowser]
 * @property {boolean|undefined} [isNode]
 * @property {boolean|undefined} [isNodeServer]
 * @property {(
 *   "type"|
 *   "validator"|
 *   "router"|
 *   "sql"|
 *   "apiClient"|
 *   "reactQuery"
 *   )[]|undefined} [enabledGenerators] Enabling specific generators.
 * @property {boolean|undefined} [useTypescript] Enable Typescript for the generators
 *    that support it
 * @property {boolean|undefined} [dumpStructure] Dump a structure.js file with the used
 *    structure in it.
 * @property {boolean|undefined} [dumpApiStructure] An api only variant of
 *    'dumpStructure'. Includes all referenced types by defined 'route' types.
 * @property {boolean|undefined} [dumpPostgres] Dump a structure.sql based on all
 *    'enableQueries' object types.
 * @property {string|undefined} [fileHeader] Custom file header.
 * @property {string} outputDirectory Directory to write files to. Note that this is
 *    recursively cleaned before writing the new files.
 * @property {false|undefined} [declareGlobalTypes]
 */

/**
 * @type {Partial<GenerateOpts>}
 */
const defaultGenerateOptionsBrowser = {
  isBrowser: true,
  isNodeServer: false,
  isNode: false,
  enabledGenerators: ["type", "apiClient", "reactQuery"],
  useTypescript: true,
  dumpStructure: false,
  dumpApiStructure: false,
  dumpPostgres: false,
};

/**
 * @type {Partial<GenerateOpts>}
 */
const defaultGenerateOptionsNodeServer = {
  isBrowser: false,
  isNodeServer: true,
  isNode: true,
  enabledGenerators: ["type", "validator", "sql", "router", "apiClient"],
  useTypescript: false,
  dumpStructure: false,
  dumpApiStructure: true,
  dumpPostgres: true,
};

/**
 * @type {Partial<GenerateOpts>}
 */
const defaultGenerateOptionsNode = {
  isBrowser: false,
  isNodeServer: false,
  isNode: true,
  enabledGenerators: ["type", "validator"],
  useTypescript: false,
  dumpStructure: false,
  dumpApiStructure: false,
  dumpPostgres: false,
};

/**
 * @class
 */
export class App {
  /**
   * @type {string[]}
   */
  static defaultEslintIgnore = ["no-unused-vars"];

  /**
   * Create a new App.
   *
   * @param {{ verbose?: boolean }} [options={}]
   */
  constructor({ verbose } = {}) {
    /**
     * @private
     * @type {string}
     */
    this.fileHeader = `// Generated by @compas/code-gen\n`;

    /**
     * @type {boolean}
     */
    this.verbose = verbose || false;

    /**
     * @type {Logger}
     */
    this.logger = newLogger({
      ctx: {
        type: "code_gen",
      },
    });

    /** @type {Set<TypeBuilderLike>} */
    this.unprocessedData = new Set();

    /** @type {import("./generated/common/types").CodeGenStructure} */
    this.data = {};
  }

  /**
   * @param {...TypeBuilderLike} builders
   * @returns {this}
   */
  add(...builders) {
    for (const builder of builders) {
      this.unprocessedData.add(builder);
    }

    return this;
  }

  /**
   * Add relations to the provided reference.
   * The provided reference must already exist.
   * This only works when referencing in to structure that you've passed in to
   * `app.extend`.
   *
   * @param {ReferenceType} reference
   * @param {...import("./builders/RelationType").RelationType} relations
   * @returns {import("@compas/stdlib").Either<App, Error>}
   */
  addRelations(reference, ...relations) {
    if (!(reference instanceof ReferenceType)) {
      return {
        error: new Error(
          `Expected T.relation as a first argument to App.addRelations`,
        ),
      };
    }

    const buildRef = reference.build();
    this.processData();

    const { group, name } = buildRef?.reference ?? {};

    const resolved = this.data[group]?.[name];

    if (!resolved) {
      return {
        error: new Error(
          `Can not resolve ${group}:${name}. Make sure to extend first via app.extend.`,
        ),
      };
    }

    if (resolved.type !== "object") {
      return {
        error: new Error(
          `Can only add relations to objects. Found '${resolved.type}'.`,
        ),
      };
    }

    for (const relation of relations) {
      // @ts-ignore
      resolved.relations.push(relation.build());
    }

    return {
      value: this,
    };
  }

  /**
   * @param {Record<string, any>} obj
   * @returns {this}
   */
  addRaw(obj) {
    if (!isNil(validateCodeGenType)) {
      // Validators present, use the result of them.
      const { value, error } = validateCodeGenType(obj);
      if (error) {
        this.logger.error(error);
        process.exit(1);
      }

      // Make a deep copy without null prototypes
      obj = {};
      merge(obj, value);
    }
    this.addToData(obj);

    return this;
  }

  /**
   * @param data
   * @returns {this}
   */
  extend(data) {
    return this.extendInternal(data, false);
  }

  /**
   * Extend from the OpenAPI spec
   *
   * @param {string} defaultGroup
   * @param {Record<string, any>} data
   * @returns {this}
   */
  extendWithOpenApi(defaultGroup, data) {
    return this.extendInternal(loadFromOpenAPISpec(defaultGroup, data), true);
  }

  /**
   * @param {import("./generator/openAPI").GenerateOpenApiOpts} options
   * @returns {Promise<void>}
   */
  async generateOpenApi(options) {
    options.verbose = options.verbose ?? this.verbose;

    if (isNil(options?.outputFile)) {
      throw new Error("Need options.outputFile to write file to.");
    }

    if (isNil(options?.inputPath)) {
      throw new Error("Need options.inputPath for compas structure");
    }

    const inputStructure = pathJoin(options.inputPath, "common/structure.js");
    if (!existsSync(inputStructure)) {
      throw new Error(
        `Invalid inputPath '${options.inputPath}'. '${inputStructure}' does not exists. Is it correctly generated?`,
      );
    }
    options.inputPath = inputStructure;

    await generateOpenApi(this.logger, options);
  }

  /**
   * @param {import("./generate-types").GenerateTypeOpts} options
   * @returns {Promise<void>}
   */
  async generateTypes(options) {
    if (isNil(options?.outputDirectory)) {
      throw new Error("Need options.outputDirectory to write files to.");
    }

    for (const path of options.inputPaths) {
      const inputStructure = pathJoin(path, "common/structure.js");
      if (!existsSync(inputStructure)) {
        throw new Error(
          `Invalid inputPath '${path}'. '${inputStructure}' does not exists. Is it correctly generated?`,
        );
      }
    }

    options.verbose = options.verbose ?? this.verbose;
    options.fileHeader =
      this.fileHeader + formatEslint() + (options.fileHeader ?? "");

    await generateTypes(this.logger, options);
  }

  /**
   * @param {GenerateOpts} options
   * @returns {Promise<void>}
   */
  async generate(options) {
    if (isNil(options?.outputDirectory)) {
      throw new Error("Need options.outputDirectory to write files to.");
    }

    if (
      isNil(options.isBrowser) &&
      isNil(options.isNodeServer) &&
      isNil(options.isNode) &&
      isNil(options.enabledGenerators)
    ) {
      throw new Error(
        `Either options.isBrowser, options.isNodeServer, options.isNode or options.enabledGenerators must be set.`,
      );
    }

    options.enabledGenerators = options.enabledGenerators || [];

    const opts = {
      outputDirectory: options.outputDirectory,
      fileHeader: this.fileHeader + formatEslint() + (options.fileHeader ?? ""),
    };

    if (
      options.isBrowser ||
      options.enabledGenerators.indexOf("reactQuery") !== -1
    ) {
      Object.assign(opts, defaultGenerateOptionsBrowser);
    } else if (
      options.isNodeServer ||
      options.enabledGenerators.indexOf("router") !== -1
    ) {
      Object.assign(opts, defaultGenerateOptionsNodeServer);
    } else if (options.isNode) {
      Object.assign(opts, defaultGenerateOptionsNode);
    }

    opts.useTypescript = options.useTypescript ?? !!opts.useTypescript;
    opts.declareGlobalTypes = options.declareGlobalTypes;
    opts.dumpStructure = options.dumpStructure ?? !!opts.dumpStructure;
    opts.dumpApiStructure = options.dumpApiStructure ?? !!opts.dumpApiStructure;
    opts.dumpPostgres = options.dumpPostgres ?? !!opts.dumpPostgres;
    opts.enabledGenerators =
      options.enabledGenerators.length > 0
        ? options.enabledGenerators
        : opts.enabledGenerators ?? [];

    // Quick hack so we can test if we have generated
    // before running the tests.
    // @ts-ignore
    if (options.returnFiles) {
      opts.returnFiles = true;
    }

    // Add internal routes
    for (const r of getInternalRoutes(opts)) {
      this.unprocessedData.add(r);
    }

    this.processData();

    hoistNamedItems(this.data, this.data);

    // Make sure to do the same case conversion here as well as to not confuse the user.
    // Other than that we don't mutate this array.
    opts.enabledGroups = options.enabledGroups?.map((it) => lowerCaseFirst(it));

    if (
      (opts.enabledGroups?.length ?? 0) === 0 &&
      Object.keys(this.data).length === 0
    ) {
      throw new Error(
        "Need at least a single group in enabledGroups, or no `enabledGroups` provided which defaults to all groups.",
      );
    }

    const groupsToInclude = opts.enabledGroups
      ? [...opts.enabledGroups]
      : Object.keys(this.data);

    // Make sure _compas/structure.json is enabled.
    // This is only needed when we have a router and dumpApiStructure is true
    if (
      opts.enabledGenerators.indexOf("router") !== -1 &&
      opts.dumpApiStructure
    ) {
      groupsToInclude.push("compas");
    }

    if (
      opts.enabledGenerators.includes("validator") &&
      (opts.enabledGenerators.includes("reactQuery") || opts.useTypescript)
    ) {
      throw new Error(
        "The 'validator' generator can't be used in combination with the 'reactQuery' generator or with the 'useTypescript' option.",
      );
    }

    // Ensure that we don't mutate the current working data of the user
    const dataCopy = JSON.parse(JSON.stringify(this.data));
    /** @type {import("./generated/common/types").CodeGenStructure} */
    const generatorInput = {};

    addGroupsToGeneratorInput(generatorInput, dataCopy, groupsToInclude);

    // validators may not be present, fallback to just stringify
    if (!isNil(validateCodeGenStructure)) {
      const { error } = validateCodeGenStructure(generatorInput);
      if (error) {
        this.logger.error(error);
        process.exit(1);
      }
    }

    const result = await generate(this.logger, opts, generatorInput);
    printProcessMemoryUsage(this.logger);
    return result;
  }

  /**
   * Internally used extend
   *
   * @param {Record<string, any>} rawStructure
   * @param {boolean} allowInternalProperties
   * @returns {this}
   */
  extendInternal(rawStructure, allowInternalProperties) {
    if (!isNil(validateCodeGenType)) {
      // Validators present, use the result of them.
      const { value, error } = validateCodeGenStructure(rawStructure);
      if (error) {
        this.logger.error(error);
        process.exit(1);
      }

      // Make a deep copy without null prototypes
      rawStructure = {};
      merge(rawStructure, value);
    }

    if (!allowInternalProperties) {
      recursivelyRemoveInternalFields(rawStructure);
    }

    for (const groupData of Object.values(rawStructure)) {
      for (const item of Object.values(groupData)) {
        this.addToData(item);
      }
    }

    return this;
  }

  /**
   * Process unprocessed list, normalize references
   * Depends on referentType being available
   *
   * @private
   */
  processData() {
    for (const item of this.unprocessedData) {
      this.addToData(buildOrInfer(item));
    }
    this.unprocessedData.clear();
  }

  /**
   * @private
   * @param item
   */
  addToData(item) {
    addToData(this.data, item);
  }
}

/**
 * Format eslint-disable comment
 *
 * @returns {string}
 */
function formatEslint() {
  return `/* eslint-disable ${App.defaultEslintIgnore.join(", ")} */\n`;
}

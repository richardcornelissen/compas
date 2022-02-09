// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

export const compasGenerateSettings = {
  outputDirectory: "packages/cli/src/generated",
  fileHeader:
    "// Generated by @compas/code-gen\n/* eslint-disable no-unused-vars */\n",
  isBrowser: false,
  isNodeServer: false,
  isNode: true,
  enabledGenerators: ["validator", "type"],
  useTypescript: false,
  dumpStructure: true,
  dumpApiStructure: false,
  dumpPostgres: false,
  declareGlobalTypes: false,
  enabledGroups: ["cli"],
};
export const cliStructureString =
  '{"completion":{"type":"anyOf","group":"cli","name":"completion","docString":"","isOptional":false,"validator":{},"values":[{"type":"object","docString":"","isOptional":false,"validator":{"strict":true},"keys":{"type":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1},"oneOf":["directory"]}},"relations":[]},{"type":"object","docString":"","isOptional":false,"validator":{"strict":true},"keys":{"type":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1},"oneOf":["file"]}},"relations":[]},{"type":"object","docString":"","isOptional":false,"validator":{"strict":true},"keys":{"type":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1},"oneOf":["completion"]},"name":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1}},"description":{"type":"string","docString":"","isOptional":true,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1}}},"relations":[]},{"type":"object","docString":"","isOptional":false,"validator":{"strict":true},"keys":{"type":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1},"oneOf":["value"]},"specification":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1},"oneOf":["boolean","number","string","booleanOrString"]},"description":{"type":"string","docString":"","isOptional":true,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1}}},"relations":[]}],"uniqueName":"CliCompletion"},"flagDefinition":{"type":"object","group":"cli","name":"flagDefinition","docString":"","isOptional":false,"validator":{"strict":true},"keys":{"name":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1}},"rawName":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":true,"upperCase":false,"min":1,"pattern":"/^--\\\\w/g"}},"description":{"type":"string","docString":"","isOptional":true,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1,"pattern":"/^[^\\\\n]+$/g"}},"modifiers":{"type":"object","docString":"","isOptional":true,"defaultValue":"{\\"isRepeatable\\":false,\\"isRequired\\":false,\\"isInternal\\":false}","validator":{"strict":true},"keys":{"isRepeatable":{"type":"boolean","docString":"","isOptional":true,"defaultValue":"false","validator":{"convert":false}},"isRequired":{"type":"boolean","docString":"","isOptional":true,"defaultValue":"false","validator":{"convert":false}},"isInternal":{"type":"boolean","docString":"","isOptional":true,"defaultValue":"false","validator":{"convert":false}}},"relations":[]},"value":{"type":"object","docString":"","isOptional":true,"defaultValue":"{\\"specification\\":\\"boolean\\"}","validator":{"strict":true},"keys":{"specification":{"type":"string","docString":"","isOptional":true,"defaultValue":"\\"boolean\\"","validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1},"oneOf":["boolean","number","string","booleanOrString"]},"validator":{"type":"any","docString":"","isOptional":true,"validator":{},"rawValue":"((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)","rawValueImport":{},"rawValidator":"((v) => typeof v === \\"function\\")","rawValidatorImport":{}},"completions":{"type":"any","docString":"","isOptional":true,"validator":{},"rawValue":"(() => Promise<{ completions: CliCompletion[] }>|{ completions: CliCompletion[] })","rawValueImport":{},"rawValidator":"((v) => typeof v === \\"function\\")","rawValidatorImport":{}}},"relations":[]}},"relations":[],"uniqueName":"CliFlagDefinition"},"commandDefinition":{"type":"object","group":"cli","name":"commandDefinition","docString":"","isOptional":false,"validator":{"strict":true},"keys":{"name":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1,"pattern":"/^[a-z-]+$/g"}},"shortDescription":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1,"pattern":"/^[^\\\\n]+$/g"}},"longDescription":{"type":"string","docString":"","isOptional":true,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1}},"modifiers":{"type":"object","docString":"","isOptional":true,"defaultValue":"{\\"isDynamic\\":false,\\"isCosmetic\\":false,\\"isWatchable\\":false}","validator":{"strict":true},"keys":{"isDynamic":{"type":"boolean","docString":"","isOptional":true,"defaultValue":"false","validator":{"convert":false}},"isCosmetic":{"type":"boolean","docString":"","isOptional":true,"defaultValue":"false","validator":{"convert":false}},"isWatchable":{"type":"boolean","docString":"","isOptional":true,"defaultValue":"false","validator":{"convert":false}}},"relations":[]},"dynamicValue":{"type":"object","docString":"","isOptional":true,"defaultValue":"{}","validator":{"strict":true},"keys":{"validator":{"type":"any","docString":"","isOptional":true,"validator":{},"rawValue":"((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)","rawValueImport":{},"rawValidator":"((v) => typeof v === \\"function\\")","rawValidatorImport":{}},"completions":{"type":"any","docString":"","isOptional":true,"validator":{},"rawValue":"(() => Promise<{ completions: CliCompletion[] }>|{ completions: CliCompletion[] })","rawValueImport":{},"rawValidator":"((v) => typeof v === \\"function\\")","rawValidatorImport":{}}},"relations":[]},"watchSettings":{"type":"object","docString":"","isOptional":true,"defaultValue":"{\\"extensions\\":[\\"js\\",\\"json\\"],\\"ignorePatterns\\":[\\".cache\\",\\"coverage\\",\\"node_modules\\"]}","validator":{"strict":true},"keys":{"extensions":{"type":"array","docString":"","isOptional":true,"defaultValue":"[\\"js\\", \\"json\\"]","validator":{"convert":false},"values":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1}}},"ignorePatterns":{"type":"array","docString":"","isOptional":true,"defaultValue":"[\\".cache\\", \\"coverage\\", \\"node_modules\\"]","validator":{"convert":false},"values":{"type":"string","docString":"","isOptional":false,"validator":{"convert":false,"trim":false,"lowerCase":false,"upperCase":false,"min":1}}}},"relations":[]},"subCommands":{"type":"array","docString":"","isOptional":true,"defaultValue":"[]","validator":{"convert":false},"values":{"type":"reference","docString":"","isOptional":false,"validator":{},"reference":{"group":"cli","name":"commandDefinition","uniqueName":"CliCommandDefinition"}}},"flags":{"type":"array","docString":"","isOptional":true,"defaultValue":"[]","validator":{"convert":false},"values":{"type":"reference","docString":"","isOptional":false,"validator":{},"reference":{"group":"cli","name":"flagDefinition","uniqueName":"CliFlagDefinition"}}},"executor":{"type":"any","docString":"","isOptional":true,"validator":{},"rawValue":"((logger: import(\\"@compas/stdlib\\").Logger, state: import(\\"../../cli/types\\").CliExecutorState) => (Promise<import(\\"../../cli/types\\").CliResult>|CliResult))","rawValueImport":{},"rawValidator":"((v) => typeof v === \\"function\\")","rawValidatorImport":{}}},"relations":[],"uniqueName":"CliCommandDefinition"}}';
export const cliStructure = JSON.parse(cliStructureString);
export const structure = Object.assign({}, { cli: cliStructure });
export const structureString = JSON.stringify(structure);

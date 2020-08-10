import { benchCommand } from "./commands/bench.js";
import {
  coverageCommand,
  dockerCommand,
  helpCommand,
  initCommand,
  lintCommand,
  proxyCommand,
  runCommand,
  testCommand,
} from "./commands/index.js";

const utilCommands = {
  help: helpCommand,
  init: initCommand,
  docker: dockerCommand,
  proxy: proxyCommand,
};

const execCommands = {
  test: testCommand,
  bench: benchCommand,
  lint: lintCommand,
  run: runCommand,
  coverage: coverageCommand,
};

/**
 * @param {Logger} logger
 * @param {UtilCommand|ExecCommand} command
 * @param {ScriptCollection} scriptCollection
 * @returns {Promise<void>}
 */
export async function execute(logger, command, scriptCollection) {
  if (command.type === "util") {
    const fn = utilCommands[command.name];
    if (fn) {
      return fn(logger, command, scriptCollection);
    }
  } else if (command.type === "exec") {
    const fn = execCommands[command.name];
    if (fn) {
      return fn(logger, command, scriptCollection);
    }
  }
}

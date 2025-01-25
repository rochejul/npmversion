import { spawn } from './io.js';
import { LOGGER } from './logger.js';

const logger = LOGGER.subLogger('commands');

/**
 * @async
 * @param {string} cmd
 * @param {string} cwd
 * @returns {Promise<string}
 */
async function executeCommand(cmd, cwd) {
  const [program, ...args] = cmd.split(' ');
  return spawn(program, args, cwd);
}

/**
 * @readonly
 * @enum {string}
 * @name NpmDependencyLevel
 */
export const DEPENDENCY_LEVEL = Object.freeze({
  none: 'none',
  peer: 'peer',
  optional: 'optional',
  dev: 'dev',
});

/**
 * @async
 * @param  {string} cwd
 */
export async function pruning(cwd) {
  logger.info(`npm prune`);
  await executeCommand(`npm prune`, cwd);
}

/**
 * @async
 * @param {string} packageVersion
 * @param  {string} cwd
 */
export async function updateRoot(packageVersion, cwd) {
  logger.info(
    `npm version ${packageVersion} --no-git-tag-version --allow-same-version`,
  );
  await executeCommand(
    `npm version ${packageVersion} --no-git-tag-version --allow-same-version`,
    cwd,
  );
}

/**
 * @async
 * @param {string} packageVersion
 * @param  {string} cwd
 */
export async function updateWorkspace(packageVersion, cwd) {
  logger.info(
    `npm version ${packageVersion} --no-git-tag-version --allow-same-version --include-workspace-root --workspaces`,
  );
  await executeCommand(
    `npm version ${packageVersion} --no-git-tag-version --allow-same-version --include-workspace-root --workspaces`,
    cwd,
  );
}

/**
 * @async
 * @param {NpmDependencyLevel} dependencyLevel
 * @param {string} dependencyName
 * @param {string} dependencyVersion
 * @param  {string} cwd
 */
export async function updateDependencyForRoot(
  dependencyLevel,
  dependencyName,
  dependencyVersion,
  cwd,
) {
  await uninstallDependencyForRoot(dependencyName, cwd);
  await installDependencyForRoot(
    dependencyLevel,
    dependencyName,
    dependencyVersion,
    cwd,
  );
}

/**
 * @async
 * @param {string} dependencyName
 * @param  {string} cwd
 */
async function uninstallDependencyForRoot(dependencyName, cwd) {
  logger.info(`npm uninstall ${dependencyName}`);
  await executeCommand(`npm uninstall ${dependencyName}`, cwd);
}

/**
 * @async
 * @param {NpmDependencyLevel} dependencyLevel
 * @param {string} dependencyName
 * @param {string} dependencyVersion
 * @param  {string} cwd
 */
async function installDependencyForRoot(
  dependencyLevel,
  dependencyName,
  dependencyVersion,
  cwd,
) {
  logger.info(
    `npm install --save${dependencyLevel === DEPENDENCY_LEVEL.none ? '' : '-' + dependencyLevel} ${dependencyName}@${dependencyVersion}`,
  );
  await executeCommand(
    `npm install --save${dependencyLevel === DEPENDENCY_LEVEL.none ? '' : '-' + dependencyLevel} ${dependencyName}@${dependencyVersion}`,
    cwd,
  );
}

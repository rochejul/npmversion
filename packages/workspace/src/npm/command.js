import { spawn } from './io.js';

/**
 * @async
 * @param {string} cmd
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise<string}
 */
async function executeCommand(cmd, cwd = process.cwd()) {
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
 * @param  {string} [cwd=process.cwd()]
 */
export async function pruning(cwd = process.cwd()) {
  await executeCommand(`npm prune`, cwd);
}

/**
 * @async
 * @param {string} packageVersion
 * @param  {string} [cwd=process.cwd()]
 */
export async function updateRoot(packageVersion, cwd = process.cwd()) {
  await executeCommand(
    `npm version ${packageVersion} --no-git-tag-version --allow-same-version`,
    cwd,
  );
}

/**
 * @async
 * @param {string} packageVersion
 * @param  {string} [cwd=process.cwd()]
 */
export async function updateWorkspace(packageVersion, cwd = process.cwd()) {
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
 * @param  {string} [cwd=process.cwd()]
 */
export async function updateDependencyForRoot(
  dependencyLevel,
  dependencyName,
  dependencyVersion,
  cwd = process.cwd(),
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
 * @param  {string} [cwd=process.cwd()]
 */
async function uninstallDependencyForRoot(dependencyName, cwd = process.cwd()) {
  await executeCommand(`npm uninstall ${dependencyName}`, cwd);
}

/**
 * @async
 * @param {NpmDependencyLevel} dependencyLevel
 * @param {string} dependencyName
 * @param {string} dependencyVersion
 * @param  {string} [cwd=process.cwd()]
 */
async function installDependencyForRoot(
  dependencyLevel,
  dependencyName,
  dependencyVersion,
  cwd = process.cwd(),
) {
  await executeCommand(
    `npm install --save${dependencyLevel === DEPENDENCY_LEVEL.none ? '' : '-' + dependencyLevel} ${dependencyName}@${dependencyVersion}`,
    cwd,
  );
}

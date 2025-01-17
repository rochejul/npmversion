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
 * @param {string} workspaceName
 * @param {NpmDependencyLevel} dependencyLevel
 * @param {string} dependencyName
 * @param {string} dependencyVersion
 * @param  {string} [cwd=process.cwd()]
 */
export async function updateDependencyForWorkspace(
  workspaceName,
  dependencyLevel,
  dependencyName,
  dependencyVersion,
  cwd = process.cwd(),
) {
  await uninstallDependencyForWorkspace(workspaceName, dependencyName, cwd);
  await installDependencyForWorkspace(
    workspaceName,
    dependencyLevel,
    dependencyName,
    dependencyVersion,
    cwd,
  );
}

/**
 * @async
 * @param {string} workspaceName
 * @param {string} dependencyName
 * @param  {string} [cwd=process.cwd()]
 */
async function uninstallDependencyForWorkspace(
  workspaceName,
  dependencyName,
  cwd = process.cwd(),
) {
  await executeCommand(
    `npm uninstall --workspace=${workspaceName} ${dependencyName}`,
    cwd,
  );
}

/**
 * @async
 * @param {string} workspaceName
 * @param {NpmDependencyLevel} dependencyLevel
 * @param {string} dependencyName
 * @param {string} dependencyVersion
 * @param  {string} [cwd=process.cwd()]
 */
async function installDependencyForWorkspace(
  workspaceName,
  dependencyLevel,
  dependencyName,
  dependencyVersion,
  cwd = process.cwd(),
) {
  await executeCommand(
    `npm install --workspace=${workspaceName} --save${dependencyLevel === DEPENDENCY_LEVEL.none ? '' : '-' + dependencyLevel} ${dependencyName}@${dependencyVersion}`,
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

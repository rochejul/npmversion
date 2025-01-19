import {
  updateWorkspace,
  updateDependencyForRoot,
  pruning,
  DEPENDENCY_LEVEL,
} from './command.js';

/** @import { Workspace } from '../model/workspace.js' */
/** @import { NpmDependencyLevel } from './command.js' */

/**
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {WorkspacePackageDependency[]} dependencies
 * @param {NpmDependencyLevel} level
 * @param {string} cwd
 */
async function updateDependency(
  workspace,
  packageVersion,
  dependencies,
  level,
  cwd,
) {
  const packageNames = workspace.workspacePackages.map(({ name }) => name);

  for (const workspacePackageDependency of dependencies) {
    if (
      !packageNames.includes(workspacePackageDependency.name) ||
      workspacePackageDependency.satisfies(packageVersion)
    ) {
      continue;
    }

    await updateDependencyForRoot(
      level,
      workspacePackageDependency.name,
      packageVersion,
      cwd,
    );
  }
}

/**
 * Update the version of the whole workspace
 * @async
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} cwd
 */
export async function updateWorkspaceVersion(workspace, packageVersion, cwd) {
  await updateWorkspace(packageVersion, cwd);
  await updateInterWorkspaceDependencies(workspace, packageVersion, cwd);
  await updateDependenciesInRoot(workspace, packageVersion, cwd);
}

async function updateInterWorkspaceDependencies(
  workspace,
  packageVersion,
  cwd,
) {
  await workspace.updateInterWorkspaceDependencies(packageVersion);
  await pruning(cwd);
}

/**
 * @async
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} cwd
 */
async function updateDependenciesInRoot(workspace, packageVersion, cwd) {
  await updateDependency(
    workspace,
    packageVersion,
    workspace.peerDependencies,
    DEPENDENCY_LEVEL.peer,
    cwd,
  );
  await updateDependency(
    workspace,
    packageVersion,
    workspace.optionalDependencies,
    DEPENDENCY_LEVEL.optional,
    cwd,
  );
  await updateDependency(
    workspace,
    packageVersion,
    workspace.devDependencies,
    DEPENDENCY_LEVEL.dev,
    cwd,
  );
  await updateDependency(
    workspace,
    packageVersion,
    workspace.dependencies,
    DEPENDENCY_LEVEL.none,
    cwd,
  );
}

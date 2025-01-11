import {
  updateWorkspaceRoot,
  updateWorkspacePackage,
  updateDependencyForWorkspace,
  DEPENDENCY_LEVEL,
} from './command.js';

/** @import { Workspace } from '../model/workspace.js' */
/** @import { WorkspacePackage } from '../model/workspace.js' */
/** @import { NpmDependencyLevel } from './command.js' */

/**
 * @param {Workspace} workspace
 * @param {WorkspacePackage} workspacePackage
 * @param {string} packageVersion
 * @param {WorkspacePackageDependency[]} dependencies
 * @param {NpmDependencyLevel} level
 * @param {string} [cwd=process.cwd()]
 */
async function updateDependency(
  workspace,
  workspacePackage,
  packageVersion,
  dependencies,
  level,
  cwd = process.cwd(),
) {
  const packageNames = workspace.workspacePackages.map(({ name }) => name);

  for (const workspacePackageDependency of dependencies) {
    if (
      !packageNames.includes(workspacePackageDependency.name) ||
      workspacePackageDependency.satisfies(packageVersion)
    ) {
      continue;
    }

    await updateDependencyForWorkspace(
      workspacePackage.name,
      level,
      workspacePackageDependency.name,
      packageVersion,
      cwd,
    );
  }
}

/**
 * Update the version of the whole workspace
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise<string}
 */
export async function updateWorkspaceVersion(
  workspace,
  packageVersion,
  cwd = process.cwd(),
) {
  const dependenciesOrder = workspace.dependenciesOrder();

  for (const workspaceName of dependenciesOrder) {
    await updateWorkspacePackage(workspaceName, packageVersion, cwd);
  }

  await updateWorkspaceRoot(packageVersion, cwd);

  for (const workspaceName of dependenciesOrder) {
    const workspacePackage = workspace.getWorkspacePackage(workspaceName);

    await updateDependency(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.peerDependencies,
      DEPENDENCY_LEVEL.peer,
      cwd,
    );
    await updateDependency(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.optionalDependencies,
      DEPENDENCY_LEVEL.optional,
      cwd,
    );
    await updateDependency(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.devDependencies,
      DEPENDENCY_LEVEL.dev,
      cwd,
    );
    await updateDependency(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.dependencies,
      DEPENDENCY_LEVEL.none,
      cwd,
    );
  }
}

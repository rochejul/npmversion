import {
  updateWorkspace,
  updateDependencyForWorkspace,
  updateDependencyForRoot,
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
async function updateDependencyForWorkspacePackage(
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
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {WorkspacePackageDependency[]} dependencies
 * @param {NpmDependencyLevel} level
 * @param {string} [cwd=process.cwd()]
 */
async function updateDependency(
  workspace,
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
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} [cwd=process.cwd()]
 */
export async function updateWorkspaceVersion(
  workspace,
  packageVersion,
  cwd = process.cwd(),
) {
  await updateWorkspace(packageVersion, cwd);
  await updateInterDependenciesInPackages(workspace, packageVersion, cwd);
  await updateDependenciesInRoot(workspace, packageVersion, cwd);
}

/**
 * @async
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} [cwd=process.cwd()]
 */
async function updateDependenciesInRoot(
  workspace,
  packageVersion,
  cwd = process.cwd(),
) {
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

/**
 * @async
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} [cwd=process.cwd()]
 */
async function updateInterDependenciesInPackages(
  workspace,
  packageVersion,
  cwd = process.cwd(),
) {
  const dependenciesOrder = workspace.dependenciesOrder();

  for (const workspaceName of dependenciesOrder) {
    const workspacePackage = workspace.getWorkspacePackage(workspaceName);

    await updateDependencyForWorkspacePackage(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.peerDependencies,
      DEPENDENCY_LEVEL.peer,
      cwd,
    );
    await updateDependencyForWorkspacePackage(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.optionalDependencies,
      DEPENDENCY_LEVEL.optional,
      cwd,
    );
    await updateDependencyForWorkspacePackage(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.devDependencies,
      DEPENDENCY_LEVEL.dev,
      cwd,
    );
    await updateDependencyForWorkspacePackage(
      workspace,
      workspacePackage,
      packageVersion,
      workspacePackage.dependencies,
      DEPENDENCY_LEVEL.none,
      cwd,
    );
  }
}

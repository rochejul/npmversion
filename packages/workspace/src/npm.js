import { promisedExec } from '@npmversion/util';
import { computeWorkspace } from './workspace.js';

/**
 * Update the package.json file, package=lock.json file and if needed workspaces
 * @param {string} packageVersion
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise<string}
 */
export async function updatePackageVersion(
  packageVersion,
  cwd = process.cwd(),
) {
  const workspace = await computeWorkspace(cwd);

  if (workspace.isLeaf()) {
    await updateRootVersion(workspace, packageVersion, cwd);
  } else {
    await updateWorkspaceVersion(workspace, packageVersion, cwd);
  }

  return packageVersion;
}

/**
 * Update the version of the root level only
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise<string}
 */
async function updateRootVersion(
  workspace,
  packageVersion,
  cwd = process.cwd(),
) {
  await promisedExec(
    `npm version ${packageVersion} --no-git-tag-version --allow-same-version`,
    false,
    cwd,
  );
}

/**
 *
 * @param {WorkspacePackage} workspacePackage
 * @param {string} packageVersion
 * @param {WorkspacePackageDependency[]} dependencies
 * @param {string} [level]
 * @param {string} [cwd=process.cwd()]
 */
async function updateDependency(
  workspacePackage,
  packageVersion,
  dependencies,
  level,
  cwd = process.cwd(),
) {
  for (const workspacePackageDependency of dependencies) {
    if (workspacePackageDependency.satisfies(packageVersion)) {
      continue;
    }

    await promisedExec(
      `npm install --force --workspace=${workspacePackage.name} --save${level ? '-' + level : ''} ${workspacePackageDependency.name}@${packageVersion}`,
      false,
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
async function updateWorkspaceVersion(
  workspace,
  packageVersion,
  cwd = process.cwd(),
) {
  await promisedExec(
    `npm version ${packageVersion} --workspaces --no-git-tag-version --allow-same-version`,
    false,
    cwd,
  );

  const dependenciesOrder = workspace.dependenciesOrder();

  for (const dependencyName of dependenciesOrder) {
    const workspacePackage = workspace.getWorkspacePackage(dependencyName);

    updateDependency(
      workspacePackage,
      packageVersion,
      workspacePackage.peerDependencies,
      'peer',
      cwd,
    );
    updateDependency(
      workspacePackage,
      packageVersion,
      workspacePackage.optionalDependencies,
      'optional',
      cwd,
    );
    updateDependency(
      workspacePackage,
      packageVersion,
      workspacePackage.devDependencies,
      'dev',
      cwd,
    );
    updateDependency(
      workspacePackage,
      packageVersion,
      workspacePackage.dependencies,
      null,
      cwd,
    );
  }

  await promisedExec(
    `npm version ${packageVersion} --include-workspace-root --no-git-tag-version --allow-same-version`,
    false,
    cwd,
  );
}

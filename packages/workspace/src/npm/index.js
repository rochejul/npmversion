import { computeWorkspace } from '../workspace.js';
import { updateRootVersion } from './without-workspaces.js';
import { updateWorkspaceVersion } from './with-workspaces.js';

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

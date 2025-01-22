import { computeWorkspace } from '../workspace/index.js';
import { updateRootVersion } from './without-workspaces.js';
import { updateWorkspaceVersion } from './with-workspaces.js';
import ProcLog from 'proc-log';

/**
 * Update the package.json file, package=lock.json file and if needed workspaces
 * @param {string} packageVersion
 * @param {string} cwd
 * @returns {Promise<string}
 */
export async function updatePackageVersion(packageVersion, cwd) {
  ProcLog.log.info('@npmcli/workspace - updatePackageVersion');
  const workspace = await computeWorkspace(cwd);

  if (workspace.isLeaf()) {
    ProcLog.log.info(
      '@npmcli/workspace - updatePackageVersion - no workspace detected',
    );
    await updateRootVersion(packageVersion, cwd);
  } else {
    ProcLog.log.info(
      '@npmcli/workspace - updatePackageVersion - workspace detected',
    );
    await updateWorkspaceVersion(workspace, packageVersion, cwd);
  }

  return packageVersion;
}

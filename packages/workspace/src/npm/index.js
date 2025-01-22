import { updateRootVersion } from './without-workspaces.js';
import { updateWorkspaceVersion } from './with-workspaces.js';
import ProcLog from 'proc-log';

/** @import { Workspace } from '../workspace/model/workspace.js' */

/**
 * Update the package.json file, package=lock.json file and if needed workspaces
 * @async
 * @param {string} packageVersion
 * @param {Workspace} workspace
 * @returns {Promise<string}
 */
export async function updatePackageVersion(packageVersion, workspace) {
  ProcLog.log.info('@npmcli/workspace - updatePackageVersion');

  if (workspace.isLeaf()) {
    ProcLog.log.info(
      '@npmcli/workspace - updatePackageVersion - no workspace detected',
    );
    await updateRootVersion(packageVersion, workspace.rootDir);
  } else {
    ProcLog.log.info(
      '@npmcli/workspace - updatePackageVersion - workspace detected',
    );
    await updateWorkspaceVersion(workspace, packageVersion, workspace.rootDir);
  }

  return packageVersion;
}

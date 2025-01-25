import { updateRootVersion } from './without-workspaces.js';
import { updateWorkspaceVersion } from './with-workspaces.js';
import { LOGGER } from './logger.js';

/** @import { Workspace } from '../workspace/model/workspace.js' */

/**
 * Update the package.json file, package=lock.json file and if needed workspaces
 *
 * @async
 * @param {string} packageVersion
 * @param {Workspace} workspace
 * @returns {Promise<string>}
 */
export async function updatePackageVersion(packageVersion, workspace) {
  const logger = LOGGER.subLogger('updatePackageVersion');

  if (workspace.isLeaf()) {
    logger.info('no workspace detected');
    await updateRootVersion(packageVersion, workspace.rootDir);
  } else {
    logger.info('workspace detected');
    await updateWorkspaceVersion(workspace, packageVersion, workspace.rootDir);
  }

  return packageVersion;
}

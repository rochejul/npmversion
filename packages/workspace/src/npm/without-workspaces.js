import { updateRoot } from './command.js';

/** @import { Workspace } from '../model/workspace.js' */

/**
 * Update the version of the root level only
 * @param {Workspace} workspace
 * @param {string} packageVersion
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise<string}
 */
export async function updateRootVersion(
  workspace,
  packageVersion,
  cwd = process.cwd(),
) {
  await updateRoot(packageVersion, cwd);
}

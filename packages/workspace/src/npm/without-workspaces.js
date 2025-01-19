import { updateRoot } from './command.js';

/**
 * Update the version of the root level only
 * @param {string} packageVersion
 * @param {string} cwd
 */
export async function updateRootVersion(packageVersion, cwd) {
  await updateRoot(packageVersion, cwd);
}

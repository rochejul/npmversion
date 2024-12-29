import { promisedExec } from '@npmversion/util';

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
  await promisedExec(
    `npm --no-git-tag-version --allow-same-version version ${packageVersion}`,
    false,
    cwd,
  );

  // TODO deal with workspace

  return packageVersion;
}

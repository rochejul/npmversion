import PackageJsonLib from '@npmcli/package-json';
import { PartialPackageJson } from './model.js';

export * from './model.js';

/**
 * @async
 * @param {string} packageJsonPath Path to a package.json file or the root dir
 * @returns {PartialPackageJson}
 */
export async function loadPackageJson(packageJsonPath) {
  const { content } = await PackageJsonLib.load(packageJsonPath);
  return new PartialPackageJson(content?.name ? content : content.default);
}

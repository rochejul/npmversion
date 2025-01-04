import JSON5 from 'json5';
import { resolve, join } from 'node:path';
import { readFile } from '../io.js';
import { PackageJson } from './model.js';

export * from './model.js';

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {PackageJson}
 */
export async function loadPackageJson(cwd = process.cwd()) {
  const packageJsonPath = resolve(join(cwd, 'package.json'));
  const packageJsonContent = await readFile(packageJsonPath);
  const packageJson = JSON5.parse(packageJsonContent);

  return new PackageJson(packageJson);
}

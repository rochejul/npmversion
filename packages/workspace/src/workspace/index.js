import { loadPackageJson } from '../packageJson/index.js';
import { findPackages } from '@pnpm/fs.find-packages';
import { dirname } from 'node:path';
import { promises as fs } from 'node:fs';

import { WorkspacePackage, Workspace } from './model/index.js';

/**
 * @async
 * @param {string} packageJsonPath File to a package.json or root dir
 * @returns {Workspace}
 */
export async function computeWorkspace(packageJsonPath) {
  const packageJson = await loadPackageJson(packageJsonPath);
  const isDirectory = (await fs.lstat(packageJsonPath)).isDirectory();
  const rootDir = isDirectory ? packageJsonPath : dirname(packageJsonPath);
  const {
    name,
    version,
    workspaces,
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
  } = packageJson;

  if (packageJson.isLeaf()) {
    return new Workspace({
      rootDir,
      name,
      version,
      dependencies,
      devDependencies,
      peerDependencies,
      optionalDependencies,
    });
  }

  const packages = await findPackages(rootDir, {
    patterns: workspaces,
  });

  const workspacePackages = packages.map(
    (packageDescriptor) =>
      new WorkspacePackage({
        rootDir: packageDescriptor.rootDirRealPath,
        name,
        version,
        ...packageDescriptor.manifest,
      }),
  );

  return new Workspace({
    rootDir,
    name,
    version,
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    workspacePackages,
  });
}

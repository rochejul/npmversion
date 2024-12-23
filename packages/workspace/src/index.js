import { loadPackageJson } from '@npmversion/util';
import { findPackages } from '@pnpm/fs.find-packages';

import { WorkspacePackage, Workspace } from './model';

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {Workspace}
 */
export async function computeWorkspace(cwd = process.cwd()) {
  const packageJson = await loadPackageJson(cwd);
  const { name, version, workspaces } = packageJson;

  if (packageJson.isLeaf()) {
    return new Workspace({ name, version });
  }

  const packages = await findPackages(cwd, {
    patterns: workspaces,
  });

  const workspacePackages = packages.map(
    (packageDescriptor) =>
      new WorkspacePackage({ name, version, ...packageDescriptor.manifest }),
  );

  return new Workspace({ name, version, workspacePackages });
}

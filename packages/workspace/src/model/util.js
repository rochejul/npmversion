import { WorkspacePackageDependency } from './workspace-package-dependency.js';

/**
 *
 * @param {Map<string, string>} deps
 * @returns {WorkspacePackageDependency[]}
 */
export function mapToWorkspacePackageDependency(deps) {
  return Array.from(deps.keys()).reduce(
    (acc, depName) => [
      ...acc,
      new WorkspacePackageDependency({
        name: depName,
        range: deps.get(depName),
      }),
    ],
    [],
  );
}

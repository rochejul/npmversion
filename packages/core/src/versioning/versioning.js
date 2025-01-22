import {
  printHelp,
  printNotFoundPackageJsonFile,
  printVersion,
  printError,
} from './help.js';
import { unpreidPackageVersion, incrementPackageVersion } from './increment.js';
import { getIncrementationLevel } from './level.js';
import {
  checkForGitIfNeeded,
  createCommitGitIfNeeded,
  createBranchGitIfNeeded,
  createTagGitIfNeeded,
  doPushGitIfNeeded,
} from './git.js';
import { updatePackageVersion, computeWorkspace } from '@npmversion/workspace';
import { VersionOptions } from '../config/index.js';

/** import { Workspace } from '@npmversion/workspace' */

/**
 * Analyze the options do the bumping / versionning
 * @async
 * @param {VersionOptions | object | null} [providedOptions]
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<string | null>} Will contain the updated package version. If null, means we needn't to compute it
 */
export async function versioning(providedOptions, cwd = process.cwd()) {
  const options =
    providedOptions instanceof VersionOptions
      ? providedOptions
      : new VersionOptions(providedOptions ?? {});
  let workspace;

  try {
    workspace = await computeWorkspace(cwd);
  } catch (_e) {
    printNotFoundPackageJsonFile();
    return null;
  }

  const packageJson = workspace.toJSON();

  if (!providedOptions || options.help) {
    printHelp(packageJson);
    return null;
  }

  // Version manipulation !
  let packageJsonVersion = packageJson.version;

  if (options.unpreid) {
    // We want to only remove the prefix
    packageJsonVersion = unpreidPackageVersion(packageJsonVersion);
  } else {
    // We want to increment the version
    packageJsonVersion = incrementPackageVersion(
      packageJsonVersion,
      getIncrementationLevel(options),
      options.preid,
      options.forcePreid,
    );
  }

  if (options.readOnly) {
    // Display the future version
    printVersion(packageJsonVersion);

    // Return the updated package version
    return packageJsonVersion;
  } else {
    // Bumping !!
    try {
      await checkForGitIfNeeded(cwd);
      await updatePackageVersion(packageJsonVersion, workspace);
      await createCommitGitIfNeeded(packageJsonVersion, options, cwd);
      await createBranchGitIfNeeded(packageJsonVersion, options, cwd);
      await createTagGitIfNeeded(packageJsonVersion, options, cwd);
      await doPushGitIfNeeded(packageJsonVersion, options, cwd);
    } catch (err) {
      printError(err);
      return;
    }

    return packageJsonVersion;
  }
}

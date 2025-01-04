import { GitNotInstalledError, NotAGitProjectError } from './exception.js';
import {
  hasGitInstalled,
  hasGitProject,
  createCommit,
  createBranch,
  createTag,
  getRemoteName,
  getBranchName,
  createBranchLabel,
  isBranchUpstream,
  isCurrentBranchUpstream,
  upstreamBranch,
  push,
} from '../git/index.js';

/** @import { VersionOptions } from '../config*/

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<void | GitNotInstalledError | NotAGitProjectError>}
 */
export async function checkForGitIfNeeded(cwd = process.cwd()) {
  let state = await hasGitInstalled(cwd);

  if (!state) {
    throw new GitNotInstalledError();
  }

  state = await hasGitProject(cwd);

  if (!state) {
    throw new NotAGitProjectError();
  }
}

/**
 * @async
 * @param {string} packageJsonVersion
 * @param {VersionOptions} options
 * @param {string} [cwd= process.cwd()]
 */
export async function createCommitGitIfNeeded(
  packageJsonVersion,
  options,
  cwd = process.cwd(),
) {
  if (options.noGitCommit) {
    return;
  }

  await createCommit(packageJsonVersion, options.gitCommitMessage, cwd);
}

/**
 * @param {string} packageJsonVersion
 * @param {VersionOptions} options
 * @param {string} [cwd= process.cwd()]
 * @returns {Promise}
 */
export async function createBranchGitIfNeeded(
  packageJsonVersion,
  options,
  cwd = process.cwd(),
) {
  if (!options.gitCreateBranch) {
    return;
  }

  await createBranch(packageJsonVersion, options?.gitBranchMessage, cwd);
}

/**
 * @async
 * @param {string} packageJsonVersion
 * @param {VersionOptions} options
 * @param {string} [cwd = process.cwd()]
 */
export async function createTagGitIfNeeded(
  packageJsonVersion,
  options,
  cwd = process.cwd(),
) {
  if (options.noGitTag) {
    return;
  }

  await createTag(packageJsonVersion, options.gitTagMessage, cwd);
}

/**
 * @async
 * @param {string} packageVersion
 * @param {VersionOptions} options
 * @param {string} [cwd = process.cwd()]
 */
export async function doPushGitIfNeeded(
  packageVersion,
  options,
  cwd = process.cwd(),
) {
  if (!options.gitPush) {
    return;
  }

  const remoteName = await (options.gitRemoteName
    ? options.gitRemoteName
    : getRemoteName(cwd));

  let isUpStreamPromise;
  let branchName = null;

  if (options.gitCommitMessage) {
    branchName = createBranchLabel(packageVersion, options.gitBranchMessage);
    isUpStreamPromise = isBranchUpstream(branchName, remoteName, cwd);
  } else {
    isUpStreamPromise = isCurrentBranchUpstream(remoteName, cwd);
  }

  const isUpstream = await isUpStreamPromise;

  if (!isUpstream) {
    if (branchName) {
      await upstreamBranch(remoteName, branchName, cwd);
    } else {
      const retrievedBranchName = await getBranchName(cwd);
      await upstreamBranch(remoteName, retrievedBranchName, cwd);
    }
  }

  await push(!options.noGitTag, cwd);
}

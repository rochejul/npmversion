import { promisedExec } from '@npmversion/util';
import {
  NoBranchGitError,
  NoRemoteGitError,
  MultipleRemoteError,
} from './exception.js';

const ESCAPE_DOUBLE_QUOTE = '\\"';
const REGEX = {
  PURCENTAGE_STRING: /%s/g,
  DOUBLE_QUOTE: /"/g,
};

/**
 * @param {string} str
 * @returns {string[]}
 */
function splitByEndOfLine(str) {
  return str ? str.replace('\r', '').split('\n').filter(Boolean) : [];
}

/**
 * Generate the branch description
 * @param {string} packageVersion
 * @param {string} [label]
 * @returns {string}
 */
export function createBranchLabel(packageVersion, label) {
  if (label) {
    return label.replace(REGEX.PURCENTAGE_STRING, packageVersion);
  }

  return `release/${packageVersion}`;
}

/**
 * Generate the tag description
 * @param {string} packageVersion
 * @param {string} [label]
 * @returns {string}
 */
export function createTagLabel(packageVersion, label) {
  if (label) {
    return label
      .replace(REGEX.PURCENTAGE_STRING, packageVersion)
      .replace(REGEX.DOUBLE_QUOTE, ESCAPE_DOUBLE_QUOTE);
  }

  return `v${packageVersion}`;
}

/**
 * Generate the commit description
 * @param {string} packageVersion
 * @param {string} [label]
 * @returns {string}
 */
export function createCommitLabel(packageVersion, label) {
  if (label) {
    return label
      .replace(REGEX.PURCENTAGE_STRING, packageVersion)
      .replace(REGEX.DOUBLE_QUOTE, ESCAPE_DOUBLE_QUOTE);
  }

  return `Release version: ${packageVersion}`;
}

/**
 * @async
 * @param {string} packageVersion
 * @param {string} [label]
 * @param {string} [cwd=process.cwd()]
 */
export async function createBranch(packageVersion, label, cwd = process.cwd()) {
  return promisedExec(
    `git branch "${createBranchLabel(packageVersion, label)}"`,
    false,
    cwd,
  );
}

/**
 * Create a commit git
 * @async
 * @param {string} packageVersion
 * @param {string} [label]
 * @param {string} [cwd=process.cwd()]
 */
export async function createCommit(packageVersion, label, cwd = process.cwd()) {
  return promisedExec(
    `git commit --all --message "${createCommitLabel(packageVersion, label)}"`,
    false,
    cwd,
  );
}

/**
 * Create a tag git
 * @async
 * @param {string} packageVersion
 * @param {string} [label]
 * @param {string} [cwd]
 */
export function createTag(packageVersion, label, cwd = process.cwd()) {
  return promisedExec(
    `git tag "${createTagLabel(packageVersion, label)}"`,
    false,
    cwd,
  );
}

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<boolean>}
 */
export async function hasGitInstalled(cwd = process.cwd()) {
  try {
    await promisedExec('git --help', true, cwd);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<boolean>}
 */
export async function hasGitProject(cwd = process.cwd()) {
  try {
    await promisedExec('git status --porcelain', true, cwd);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<string | NoBranchGitError>}
 */
export async function getBranchName(cwd = process.cwd()) {
  const outputData = await promisedExec(
    'git rev-parse --abbrev-ref HEAD',
    true,
    cwd,
  );

  if (outputData) {
    return splitByEndOfLine(outputData)[0];
  }

  throw new NoBranchGitError();
}

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<string | NoRemoteGitError | MultipleRemoteError>}
 */
export async function getRemoteName(cwd = process.cwd()) {
  const remotes = await getRemoteNameList(cwd);

  if (remotes.length === 1) {
    return remotes[0];
  } else if (remotes.length > 1) {
    throw new MultipleRemoteError();
  }

  throw new NoRemoteGitError();
}

/**
 * @async
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<string[]>}
 */
export async function getRemoteNameList(cwd = process.cwd()) {
  const ouputData = await promisedExec('git remote', true, cwd);
  return splitByEndOfLine(ouputData);
}

/**
 * @param {string} [remoteName]
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<boolean>}
 */
export async function isCurrentBranchUpstream(remoteName, cwd = process.cwd()) {
  const branchName = await getBranchName(cwd);
  return isBranchUpstream(branchName, remoteName, cwd);
}

/**
 * @param {string} branchName
 * @param {string} [remoteName]
 * @param {string} [cwd=process.cwd()]
 * @returns {Promise.<boolean>}
 */
export async function isBranchUpstream(
  branchName,
  remoteName,
  cwd = process.cwd(),
) {
  try {
    const results = await Promise.all([
      promisedExec('git branch -rvv', true, cwd),
      remoteName ? remoteName : getRemoteName(cwd),
    ]);

    const remoteBrancheLines = splitByEndOfLine(results[0]);
    const remoteNameToUse = results[1];
    const remoteBranch = `${remoteNameToUse}/${branchName}`;

    const remoteBranchLine = remoteBrancheLines.find(
      (remoteBranchLine) => remoteBranchLine.indexOf(remoteBranch) >= 0,
    );

    return !!remoteBranchLine;
  } catch (e) {
    return false;
  }
}

/**
 * Push the commits and the tags if needed
 * @async
 * @param {boolean} [tags=false]
 * @param {string} [cwd=process.cwd()]
 */
export async function push(tags, cwd = process.cwd()) {
  return promisedExec(
    `git push${tags ? ' && git push --tags --no-verify' : ''}`,
    false,
    cwd,
  );
}

/**
 * Push the branch if needed
 * @async
 * @param {string} remoteName
 * @param {string} branchName
 * @param {string} [cwd=process.Cwd()]
 */
export async function upstreamBranch(
  remoteName,
  branchName,
  cwd = process.cwd(),
) {
  return promisedExec(
    `git push --set-upstream ${remoteName} ${branchName}`,
    false,
    cwd,
  );
}

import { PackageJson } from '@npmversion/util';
import {
  HELP_TEXT,
  NOT_FOUND_PACKAGE_JSON_FILE,
  GIT_NOT_INSTALLED,
  NOT_INTO_GIT_PROJECT,
  NO_REMOTE_GIT,
  MULTIPLE_REMOTE_GIT,
} from '../messages';

import { GitNotInstalledError, NotAGitProjectError } from './exception.js';
import { NoRemoteGitError, MultipleRemoteError } from '../git';

/**
 * @param {PackageJson} packageJson
 */
export function printHelp(packageJson) {
  console.log(HELP_TEXT, packageJson.version, packageJson.description);
}

export function printNotFoundPackageJsonFile() {
  console.error(NOT_FOUND_PACKAGE_JSON_FILE);
  process.exit(1);
}

/**
 * Print the nearest version
 * @param {string} packageVersion
 */
export function printVersion(packageVersion) {
  console.log('Nearest version: ', packageVersion);
}

/**
 *
 * @param {Error | string | null} err
 */
export function printError(err) {
  if (err instanceof GitNotInstalledError) {
    console.error(GIT_NOT_INSTALLED);
  } else if (err instanceof NotAGitProjectError) {
    console.error(NOT_INTO_GIT_PROJECT);
  } else if (err instanceof NoRemoteGitError) {
    console.error(NO_REMOTE_GIT);
  } else if (err instanceof MultipleRemoteError) {
    console.error(MULTIPLE_REMOTE_GIT);
  } else {
    console.error(err?.stack ?? err);
  }

  process.exit(1);
}

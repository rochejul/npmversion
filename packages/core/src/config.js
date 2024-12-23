import rc from 'rc';
import {
  GIT_COMMIT_MESSAGE,
  GIT_BRANCH_MESSAGE,
  GIT_TAG_MESSAGE,
} from './messages';

const CONFIG_NAME = 'npmversion';

/**
 * @name {VersionOptions}
 */
const RC_OPTIONS = {
  'force-preid': false,
  'nogit-commit': false,
  'nogit-tag': false,
  'git-push': false,
  'git-create-branch': false,
  'git-commit-message': GIT_COMMIT_MESSAGE,
  'git-branch-message': GIT_BRANCH_MESSAGE,
  'git-tag-message': GIT_TAG_MESSAGE,
  'git-remote-name': null,
  increment: 'patch',
  ignoreErrorJsonFile: false,
  jsonFiles: [],
};

/**
 * @name rcOptionsRetriever
 * @returns {VersionOptions}
 */
export function configRetriever() {
  const { config, configs, ...versionOptions } = rc(
    CONFIG_NAME,
    RC_OPTIONS,
    [],
  );
  return versionOptions;
}

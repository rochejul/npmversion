import rc from 'rc';
import {
  GIT_COMMIT_MESSAGE,
  GIT_BRANCH_MESSAGE,
  GIT_TAG_MESSAGE,
} from './messages';
import { LEVEL_ENUM } from './versioning/level';

const CONFIG_NAME = 'npmversion';

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
  increment: LEVEL_ENUM.patch,
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
  return new VersionOptions(versionOptions);
}

/**
 * @module @npmversion/core
 */
export class VersionOptions {
  #help;
  #unpreid;
  #forcePreid;
  #readOnly;
  #noGitCommit;
  #noGitTag;
  #gitPush;
  #gitCreateBranch;
  #increment;
  #preid;
  #gitRemoteName;
  #gitBranchMessage;
  #gitCommitMessage;
  #gitTagMessage;

  constructor({ help = false, unpreid = false, preid = false, ...rest }) {
    this.#help = help;
    this.#unpreid = unpreid;
    this.#forcePreid = rest['force-preid'] ?? RC_OPTIONS['force-preid'];
    this.#readOnly = rest['read-only'] ?? false;
    this.#noGitCommit = rest['nogit-commit'] ?? RC_OPTIONS['nogit-commit'];
    this.#noGitTag = rest['nogit-tag'] ?? RC_OPTIONS['nogit-tag'];
    this.#gitPush = rest['git-push'] ?? RC_OPTIONS['git-push'];
    this.#gitCreateBranch =
      rest['git-create-branch'] ?? RC_OPTIONS['git-create-branch'];
    this.#increment = rest.increment ?? RC_OPTIONS.increment;
    this.#preid = preid;
    this.#gitRemoteName =
      rest['git-remote-name'] ?? RC_OPTIONS['git-remote-name'];
    this.#gitBranchMessage =
      rest['git-branch-message'] ?? RC_OPTIONS['git-branch-message'];
    this.#gitCommitMessage =
      rest['git-commit-message'] ?? RC_OPTIONS['git-commit-message'];
    this.#gitTagMessage =
      rest['git-tag-message'] ?? RC_OPTIONS['git-tag-message'];
  }

  get help() {
    return this.#help;
  }

  get unpreid() {
    return this.#unpreid;
  }

  get forcePreid() {
    return this.#forcePreid;
  }

  get readOnly() {
    return this.#readOnly;
  }

  get noGitCommit() {
    return this.#noGitCommit;
  }

  get noGitTag() {
    return this.#noGitTag;
  }

  get gitPush() {
    return this.#gitPush;
  }

  get gitCreateBranch() {
    return this.#gitCreateBranch;
  }

  get increment() {
    return this.#increment;
  }

  get preid() {
    return this.#preid;
  }

  get gitRemoteName() {
    return this.#gitRemoteName;
  }

  get gitBranchMessage() {
    return this.#gitBranchMessage;
  }

  get gitCommitMessage() {
    return this.#gitCommitMessage;
  }

  get gitTagMessage() {
    return this.#gitTagMessage;
  }

  toJSON() {
    return Object.freeze({
      help: this.#help,
      unpreid: this.#unpreid,
      'force-preid': this.#forcePreid,
      'read-only': this.#readOnly,
      'no-git-commit': this.#noGitCommit,
      'no-git-tag': this.#noGitTag,
      'git-push': this.#gitPush,
      'git-create-branch': this.#gitCreateBranch,
      increment: this.#increment,
      preid: this.#preid,
      'git-remote-name': this.#gitRemoteName,
      'git-branch-message': this.#gitBranchMessage,
      'git-commit-message': this.#gitCommitMessage,
      'git-tag-message': this.#gitTagMessage,
    });
  }
}

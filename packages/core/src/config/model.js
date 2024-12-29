import { DEFAULT_OPTIONS } from './default.js';

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

  constructor({ help = false, unpreid = false, preid = false, ...rest } = {}) {
    this.#help = help;
    this.#unpreid = unpreid;
    this.#forcePreid = rest['force-preid'] ?? DEFAULT_OPTIONS['force-preid'];
    this.#readOnly = rest['read-only'] ?? false;
    this.#noGitCommit = rest['nogit-commit'] ?? DEFAULT_OPTIONS['nogit-commit'];
    this.#noGitTag = rest['nogit-tag'] ?? DEFAULT_OPTIONS['nogit-tag'];
    this.#gitPush = rest['git-push'] ?? DEFAULT_OPTIONS['git-push'];
    this.#gitCreateBranch =
      rest['git-create-branch'] ?? DEFAULT_OPTIONS['git-create-branch'];
    this.#increment = rest.increment ?? DEFAULT_OPTIONS.increment;
    this.#preid = preid;
    this.#gitRemoteName =
      rest['git-remote-name'] ?? DEFAULT_OPTIONS['git-remote-name'];
    this.#gitBranchMessage =
      rest['git-branch-message'] ?? DEFAULT_OPTIONS['git-branch-message'];
    this.#gitCommitMessage =
      rest['git-commit-message'] ?? DEFAULT_OPTIONS['git-commit-message'];
    this.#gitTagMessage =
      rest['git-tag-message'] ?? DEFAULT_OPTIONS['git-tag-message'];
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
      'nogit-commit': this.#noGitCommit,
      'nogit-tag': this.#noGitTag,
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

  static default() {
    return new VersionOptions().toJSON();
  }
}

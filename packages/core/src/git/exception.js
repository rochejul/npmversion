export class NoBranchGitError extends Error {
  constructor() {
    super('No branch Git seems to be declared');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoBranchGitError);
    }
  }
}

export class NoRemoteGitError extends Error {
  constructor() {
    super('No remote Git seems to be declared');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoRemoteGitError);
    }
  }
}

export class MultipleRemoteError extends Error {
  constructor() {
    super('Multiple remote Git have been detected');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MultipleRemoteError);
    }
  }
}

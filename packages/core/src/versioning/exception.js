export class GitNotInstalledError extends Error {
  constructor() {
    super('Git seems not be to be installed');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GitNotInstalledError);
    }
  }
}

export class NotAGitProjectError extends Error {
  constructor() {
    super('It seems there is not initialized git project');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotAGitProjectError);
    }
  }
}

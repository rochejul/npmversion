jest.unstable_mockModule('../src/versioning/help.js', async () => ({
  printHelp: jest.fn(),
  printNotFoundPackageJsonFile: jest.fn(),
  printVersion: jest.fn(),
  printError: jest.fn(),
}));

jest.unstable_mockModule('@npmversion/util', async () => ({
  loadPackageJson: jest.fn(),
  promisedExec: jest.fn(),
  readFile: jest.fn(),
}));

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import '@npmversion/jest-utils';

const { loadPackageJson, promisedExec } = await import('@npmversion/util');
const { printHelp, printNotFoundPackageJsonFile, printVersion, printError } =
  await import('../../src/versioning/help.js');
const {
  versioning,
  GitNotInstalledError,
  NotAGitProjectError,
  NoRemoteGitError,
  MultipleRemoteError,
} = await import('../../src/versioning');

const DEFAULT_CWD = process.cwd();

function mockPromiseExecWhenNotRemote(cmd) {
  if (cmd === 'git remote') {
    return 'origin';
  }
}

function mockPromisedExecWhenRemote(cmd) {
  if (cmd === 'git remote') {
    return 'origin';
  }

  if (cmd == 'git branch -rvv') {
    return 'origin/master';
  }
}

describe('@npmversion/core - await versioning', () => {
  beforeEach(() => {
    loadPackageJson.mockResolvedValue({
      version: '0.0.1',
      isLeaf() {
        return true;
      },
    });
  });

  describe('should print the help', () => {
    test('no options are passed', async () => {
      // Act
      await versioning();

      // Assert
      expect(printHelp).toHaveBeenCalledWith(expect.anything());
    });

    test('if the help option is passed', async () => {
      // Act
      await versioning({ help: true });

      // Assert
      expect(printHelp).toHaveBeenCalledWith(expect.anything());
    });
  });

  test('should print an error message if no package.json file was detected', async () => {
    // Arrange
    loadPackageJson.mockRejectedValue(new Error('An error occured'));

    // Act
    await versioning({ increment: 'patch' });

    // Assert
    expect(printNotFoundPackageJsonFile).toHaveBeenCalledWith();
  });

  test('should print the bump result if read only is set', async () => {
    // Act

    await versioning({ increment: 'patch', 'read-only': true });

    // Assert
    expect(printVersion).toHaveBeenCalledWith(expect.anything());
  });

  describe('should increment the version', () => {
    test('if the option is set', async () => {
      // Act
      await versioning({ increment: 'patch', 'read-only': true });

      // Assert
      expect(printVersion).toHaveBeenCalledWith('0.0.2');
    });

    test('to "patch" if the level is not recognized', async () => {
      // Act
      await versioning({ increment: 'fake', 'read-only': true });

      // Assert
      expect(printVersion).toHaveBeenCalledWith('0.0.2');
    });

    test('with all possible options', async () => {
      // Act
      await versioning({
        increment: 'PATCH',
        'read-only': true,
        preid: 'beta',
        'force-preid': true,
      });

      // Assert
      expect(printVersion).toHaveBeenCalledWith('0.0.2-beta');
    });
  });

  test('should unpreid the version if the option is specified', async () => {
    // Arrange
    loadPackageJson.mockResolvedValue({ version: '0.0.1-snapshot' });

    // Act
    await versioning({
      unpreid: true,
      'read-only': true,
    });

    // Assert
    expect(printVersion).toHaveBeenCalledWith('0.0.1');
  });

  describe('should use git,', () => {
    test('and log a message if Git is not installed', async () => {
      // Arrange
      promisedExec.mockRejectedValue(new GitNotInstalledError());

      // Act
      await versioning({ increment: 'fake' });

      // Assert
      expect(printError).toHaveBeenCalledWith(expect.anything());
    });

    test('and log a message if we are not into a Git project', async () => {
      // Arrange
      promisedExec.mockRejectedValue(new NotAGitProjectError());

      // Act
      await versioning({ increment: 'fake' });

      // Assert
      expect(printError).toHaveBeenCalledWith(expect.anything());
    });

    test('and log a message if we have no remote', async () => {
      // Arrange
      promisedExec.mockRejectedValue(new NoRemoteGitError());

      // Act
      await versioning({ increment: 'fake' });

      // Assert
      expect(printError).toHaveBeenCalledWith(expect.anything());
    });

    test('and log a message if we have multiple remotes', async () => {
      // Arrange
      promisedExec.mockRejectedValue(new MultipleRemoteError());

      // Act
      await versioning({ increment: 'fake' });

      // Assert
      expect(printError).toHaveBeenCalledWith(expect.anything());
    });

    test('and log an error if needed', async () => {
      // Arrange
      promisedExec.mockRejectedValue(new Error('unexpected error'));

      // Act
      await versioning({ increment: 'fake' });

      // Assert
      expect(printError).toHaveBeenCalledWith(expect.anything());
    });

    describe('expecially', () => {
      beforeEach(() => {
        loadPackageJson.mockResolvedValue({
          version: '1.2.0',
          isLeaf() {
            return true;
          },
        });
      });

      test('create by default a commit and a tag', async () => {
        // Act
        await versioning({ increment: 'fake' });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(5);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git tag "v1.2.1"',
          false,
          DEFAULT_CWD,
        );
      });

      test('create the branch', async () => {
        // Act
        await versioning({ increment: 'fake', 'git-create-branch': true });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(6);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git branch "release/1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git tag "v1.2.1"',
          false,
          DEFAULT_CWD,
        );
      });

      test('push the local branch, commit and the tag', async () => {
        // Arrange
        promisedExec.mockImplementation(mockPromisedExecWhenRemote);

        // Act
        await versioning({
          increment: 'fake',
          'git-push': true,
          'nogit-commit': false,
        });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(9);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git tag "v1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git remote',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git branch -rvv',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push --set-upstream origin release/1.2.1',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push && git push --tags --no-verify',
          false,
          DEFAULT_CWD,
        );
      });

      test('push the local branch on the specified origin, commit and the tag', async () => {
        // Arrange
        promisedExec.mockImplementation(mockPromiseExecWhenNotRemote);

        // Act
        await versioning({
          increment: 'fake',
          'git-push': true,
          'git-remote-name': 'anotherOrigin',
        });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(8);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git tag "v1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git branch -rvv',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push --set-upstream anotherOrigin release/1.2.1',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push && git push --tags --no-verify',
          false,
          DEFAULT_CWD,
        );
      });

      test('push commit and the tag (because the local branch is associated to a remote branch)', async () => {
        // Arrange
        promisedExec.mockImplementation(mockPromisedExecWhenRemote);

        // Act
        await versioning({
          increment: 'fake',
          'git-push': true,
        });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(9);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git tag "v1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git remote',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git branch -rvv',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push --set-upstream origin release/1.2.1',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push && git push --tags --no-verify',
          false,
          DEFAULT_CWD,
        );
      });

      test('push commit, the branch and the tag (because the local branch is not associated to a remote branch)', async () => {
        // Arrange
        promisedExec.mockImplementation(mockPromiseExecWhenNotRemote);

        // Act
        await versioning({
          increment: 'fake',
          'git-push': true,
        });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(9);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git tag "v1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git remote',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git branch -rvv',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push --set-upstream origin release/1.2.1',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push && git push --tags --no-verify',
          false,
          DEFAULT_CWD,
        );
      });

      test('push using the specified remote name', async () => {
        // Arrange
        promisedExec.mockImplementation(mockPromiseExecWhenNotRemote);

        // Act
        await versioning({
          increment: 'fake',
          'git-push': true,
          'git-remote-name': 'anotherOrigin',
        });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(8);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git tag "v1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git branch -rvv',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push --set-upstream anotherOrigin release/1.2.1',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push && git push --tags --no-verify',
          false,
          DEFAULT_CWD,
        );
      });

      test('push only the commit if no tag is generated', async () => {
        // Arrange
        promisedExec.mockImplementation(mockPromiseExecWhenNotRemote);

        // Act
        await versioning({
          increment: 'fake',
          'git-push': true,
          'nogit-tag': true,
        });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(8);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git commit --all --message "Release version: 1.2.1"',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git remote',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git branch -rvv',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push --set-upstream origin release/1.2.1',
          false,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git push',
          false,
          DEFAULT_CWD,
        );
      });

      test('create no commit if specified', async () => {
        // Act
        await versioning({
          increment: 'fake',
          'nogit-commit': true,
          'nogit-tag': true,
        });

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(3);
        expect(promisedExec).toHaveBeenCalledWith(
          'git --help',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          DEFAULT_CWD,
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          DEFAULT_CWD,
        );
      });

      test('use the specified cwd', async () => {
        // Act
        await versioning(
          {
            increment: 'fake',
            'nogit-commit': true,
            'nogit-tag': true,
          },
          '/etc',
        );

        // Assert
        expect(printError).not.toHaveBeenCalled();
        expect(promisedExec).toHaveBeenCalledTimes(3);
        expect(promisedExec).toHaveBeenCalledWith('git --help', true, '/etc');
        expect(promisedExec).toHaveBeenCalledWith(
          'git status --porcelain',
          true,
          '/etc',
        );
        expect(promisedExec).toHaveBeenCalledWith(
          'npm version 1.2.1 --no-git-tag-version --allow-same-version',
          false,
          '/etc',
        );
      });
    });
  });

  test('shoud deal with an arbitrary options set', async () => {
    // Arrange
    loadPackageJson.mockResolvedValue({
      version: '1.2.0',
      isLeaf() {
        return true;
      },
    });

    promisedExec.mockImplementation(mockPromiseExecWhenNotRemote);

    // Case:
    //  > npm run npmversion -- --increment patch --preid beta --nogit-tag --git-push
    // {
    //     "force-preid": true,
    //     "nogit-commit": false,
    //     "nogit-tag": true,
    //     "git-push": false,
    //     "git-commit-message": "Release version: %s",
    //     "git-tag-message": "v%s",
    //     "increment": "minor"
    // }

    // Act
    await versioning({
      help: false,
      unpreid: false,
      'force-preid': true,
      'read-only': false,
      'nogit-commit': false,
      'nogit-tag': true,
      'git-push': true,
      increment: 'patch',
      preid: 'beta',
      'git-commit-message': 'Release version: %s',
      'git-tag-message': 'v%s',
    });

    // Arrange
    expect(printError).not.toHaveBeenCalled();
    expect(promisedExec).toHaveBeenCalledTimes(8);
    expect(promisedExec).toHaveBeenCalledWith('git --help', true, DEFAULT_CWD);
    expect(promisedExec).toHaveBeenCalledWith(
      'git status --porcelain',
      true,
      DEFAULT_CWD,
    );
    expect(promisedExec).toHaveBeenCalledWith(
      'npm version 1.2.1-beta --no-git-tag-version --allow-same-version',
      false,
      DEFAULT_CWD,
    );
    expect(promisedExec).toHaveBeenCalledWith(
      'git commit --all --message "Release version: 1.2.1-beta"',
      false,
      DEFAULT_CWD,
    );
    expect(promisedExec).toHaveBeenCalledWith('git remote', true, DEFAULT_CWD);
    expect(promisedExec).toHaveBeenCalledWith(
      'git branch -rvv',
      true,
      DEFAULT_CWD,
    );
    expect(promisedExec).toHaveBeenCalledWith(
      'git push --set-upstream origin release/1.2.1-beta',
      false,
      DEFAULT_CWD,
    );
    expect(promisedExec).toHaveBeenCalledWith('git push', false, DEFAULT_CWD);
  });
});

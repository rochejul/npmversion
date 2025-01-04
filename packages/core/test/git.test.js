jest.unstable_mockModule('@npmversion/util', async () => ({
  promisedExec: jest.fn(),
}));

import { describe, test, expect, jest } from '@jest/globals';
import '@npmversion/jest-utils';

const { promisedExec: mockPromiseExec } = await import('@npmversion/util');
const {
  createBranchLabel,
  createCommitLabel,
  createTagLabel,
  hasGitInstalled,
  hasGitProject,
  getBranchName,
  getRemoteName,
  getRemoteNameList,
  isCurrentBranchUpstream,
  isBranchUpstream,
  push,
  createBranch,
  createCommit,
  createTag,
  upstreamBranch,
  NoBranchGitError,
  NoRemoteGitError,
  MultipleRemoteError,
} = await import('../src/git');

const DEFAULT_CWD = process.cwd();

describe('@npmversion/core - git', () => {
  describe('createBranchLabel', () => {
    test('should return a default value if no label set', () => {
      expect(createBranchLabel('1.2.3')).toBe('release/1.2.3');
    });

    test('should inject the package version if a label is set', () => {
      expect(createBranchLabel('1.2.3', 'releases/%s')).toBe('releases/1.2.3');
    });
  });

  describe('createCommitLabel', () => {
    test('should return a default value if no label set', () => {
      expect(createCommitLabel('1.2.3')).toBe('Release version: 1.2.3');
    });

    test('should inject the package version if a label is set', () => {
      expect(createCommitLabel('1.2.3', 'Release: %s')).toBe('Release: 1.2.3');
    });

    test('should escape the double quote if a label is set', () => {
      expect(createCommitLabel('1.2.3', 'Release: "%s"')).toBe(
        'Release: \\"1.2.3\\"',
      );
    });
  });

  describe('createTagLabel', () => {
    test('should return a default value if no label set', () => {
      expect(createTagLabel('1.2.3')).toBe('v1.2.3');
    });

    test('should inject the package version if a label is set', () => {
      expect(createTagLabel('1.2.3', '%s')).toBe('1.2.3');
    });

    test('should escape the double quote if a label is set', () => {
      expect(createTagLabel('1.2.3', 'Version "%s"')).toBe(
        'Version \\"1.2.3\\"',
      );
    });
  });

  describe('hasGitInstalled', () => {
    test('should return false if the git command is not recognized', async () => {
      // Arrange
      mockPromiseExec.mockRejectedValue('command not recognized');

      // Act & Assert
      await expect(hasGitInstalled()).resolves.toBeFalsy();
    });

    test('should return true otherwise', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act & Assert
      await expect(hasGitInstalled()).resolves.toBeTruthy();
    });

    test('should use the default cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await hasGitInstalled();

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use the provided cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await hasGitInstalled('/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('hasGitProject', () => {
    test('should return false if the cwd is not into a git project', async () => {
      // Arrange
      mockPromiseExec.mockRejectedValue(
        'fatal: Not a git repository (or any of the parent directories): .git',
      );

      // Act && Assert
      await expect(hasGitProject()).resolves.toBeFalsy();
    });

    test('should return true otherwise', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act && Assert
      await expect(hasGitProject()).resolves.toBeTruthy();
    });

    test('should use the default cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await hasGitProject();

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use the provided cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await hasGitProject('/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('getBranchName', () => {
    test('should return the branch name', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('releases/1.0.0');

      // Act
      const actual = await getBranchName();

      // Assert
      expect(actual).toBe('releases/1.0.0');
    });

    test('should ignore some carriage return', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('releases/1.0.0\n');

      // Act
      const actual = await getBranchName();

      // Assert
      expect(actual).toBe('releases/1.0.0');
    });

    test('should raise the exception NoBranchGitError if no branch was detected', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('');

      // Act & Assert
      await expect(getBranchName()).rejects.toThrow(NoBranchGitError);
    });

    test('should use the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('releases/1.0.0\n');

      // Act
      await getBranchName('/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('getRemoteName', () => {
    test('should return the origin name', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('origin');

      // Act
      const actual = await getRemoteName();

      // Assert
      expect(actual).toBe('origin');
    });

    test('should raise the exception NoRemoteGitError if no remotes were detected', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('');

      // Act & Assert
      await expect(getRemoteName()).rejects.toThrow(NoRemoteGitError);
    });

    test('should raise the exception MultipleRemoteError if no remotes were detected', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('origin\nanotherRemote');

      // Act & Assert
      await expect(getRemoteName()).rejects.toThrow(MultipleRemoteError);
    });

    test('should use the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('origin');

      // Act
      await getRemoteName('/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('getRemoteNameList', () => {
    test('should return the remote names (1)', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('');

      // Act
      const actual = await getRemoteNameList();

      // Assert
      expect(actual).toStrictEqual([]);
    });

    test('should return the remote names (2)', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('origin');

      // Act
      const actual = await getRemoteNameList();

      // Assert
      expect(actual).toStrictEqual(['origin']);
    });

    test('should return the remote names (3)', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('origin\nupstream');

      // Act
      const actual = await getRemoteNameList();

      // Assert
      expect(actual).toStrictEqual(['origin', 'upstream']);
    });

    test('should use the default cwd', async () => {
      // Act
      await getRemoteNameList();

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue('origin');

      // Act
      await getRemoteNameList('/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('isCurrentBranchUpstream', () => {
    test('should raise the exception NoBranchGitError if no branch was detected', async () => {
      // Arrange
      mockPromiseExec.mockRejectedValue(new NoBranchGitError());

      // Act & Assert
      await expect(isCurrentBranchUpstream()).rejects.toThrow(NoBranchGitError);
    });

    test('should return false if the current branch is not linked to a remote branch', async () => {
      // Arrange
      mockPromiseExec
        .mockResolvedValueOnce('releases/1.0.0')
        .mockResolvedValueOnce(
          `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/0.9.0 f35d72b use of babel-preset-env instead
`,
        )
        .mockResolvedValueOnce('origin');

      // Act
      const actual = await isCurrentBranchUpstream();

      // Assert
      expect(actual).toBeFalsy();
    });

    test('should return true if the current branch is linked to a remote branch', async () => {
      // Arrange
      mockPromiseExec
        .mockResolvedValueOnce('releases/1.0.0')
        .mockResolvedValueOnce(
          `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`,
        )
        .mockResolvedValueOnce('origin');

      // Act
      const actual = await isCurrentBranchUpstream();

      // Assert
      expect(actual).toBeTruthy();
    });

    test('should use the specified origin', async () => {
      // Arrange
      mockPromiseExec
        .mockResolvedValueOnce('releases/1.0.0')
        .mockResolvedValueOnce(
          `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`,
        );

      // Act
      await isCurrentBranchUpstream('anotherOrigin', '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledTimes(2);
    });

    test('should use the specified cwd', async () => {
      // Arrange
      mockPromiseExec
        .mockResolvedValueOnce('releases/1.0.0')
        .mockResolvedValueOnce(
          `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`,
        );

      // Act
      await isCurrentBranchUpstream('anotherOrigin', '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('isBranchUpstream', () => {
    test('should return false if an error occured', async () => {
      // Arrange
      mockPromiseExec.mockRejectedValue();

      // Act
      const actual = await isBranchUpstream('releases/1.0.0');

      // Assert
      expect(actual).toBeFalsy();
    });

    test('should return false if no remote branches', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValueOnce('').mockResolvedValueOnce('origin');

      // Act
      const actual = await isBranchUpstream('releases/1.0.0');

      // Assert
      expect(actual).toBeFalsy();
    });

    test('should return false if the local branch has no associated remote branch', async () => {
      // Arrange
      mockPromiseExec
        .mockResolvedValueOnce(
          `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/0.9.0 f35d72b use of babel-preset-env instead
`,
        )
        .mockResolvedValueOnce('origin');

      // Act
      const actual = await isBranchUpstream('releases/1.0.0');

      // Assert
      expect(actual).toBeFalsy();
    });

    test('should return true otherwise', async () => {
      // Arrange
      mockPromiseExec
        .mockResolvedValueOnce(
          `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`,
        )
        .mockResolvedValueOnce('origin');

      // Act
      const actual = await isBranchUpstream('releases/1.0.0');

      // Assert
      expect(actual).toBeTruthy();
    });

    test('should use the specified origin', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValueOnce(
        `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`,
      );

      // Act
      await isBranchUpstream('releases/1.0.0', 'anotherOrigin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledTimes(1);
    });

    test('should use the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValueOnce(
        `origin/HEAD          -> origin/master
origin/master        ec904e9 Last commiy
origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`,
      );

      // Act
      await isBranchUpstream('releases/1.0.0', 'anotherOrigin', '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('push', () => {
    test('should not push the tags if not specified', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await push(false);

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git push',
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should push the tags otherwise', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await push(true);

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git push && git push --tags --no-verify',
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use  the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await push(false, '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('createBranch', () => {
    test('should create a git commit', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await createBranch('1.2.3', 'releases/%s');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git branch "releases/1.2.3"',
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use  the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await createBranch('1.2.3', 'releases/%s', '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git branch "releases/1.2.3"',
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('createCommit', () => {
    test('should create a git commit', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await createCommit('1.2.3', 'Change version to %s');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git commit --all --message "Change version to 1.2.3"',
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use  the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await createCommit('1.2.3', 'Change version to %s', '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git commit --all --message "Change version to 1.2.3"',
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('createTag', () => {
    test('should create a git tag', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await createTag('1.2.3', 'v%s');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git tag "v1.2.3"',
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use  the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await createTag('1.2.3', 'v%s', '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git tag "v1.2.3"',
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });

  describe('upstreamBranch', () => {
    test('should push the branch to remote', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await upstreamBranch('origin', 'releases/1.0.0');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git push --set-upstream origin releases/1.0.0',
        expect.any(Boolean),
        DEFAULT_CWD,
      );
    });

    test('should use the specified cwd', async () => {
      // Arrange
      mockPromiseExec.mockResolvedValue();

      // Act
      await upstreamBranch('origin', 'releases/1.0.0', '/etc/bin');

      // Assert
      expect(mockPromiseExec).toHaveBeenCalledWith(
        'git push --set-upstream origin releases/1.0.0',
        expect.any(Boolean),
        '/etc/bin',
      );
    });
  });
});

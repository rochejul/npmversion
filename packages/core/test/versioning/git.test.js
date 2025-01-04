jest.unstable_mockModule('../src/git/git.js', async () => ({
  hasGitInstalled: jest.fn(),
  hasGitProject: jest.fn(),
  createCommit: jest.fn(),
  createBranch: jest.fn(),
  createTag: jest.fn(),
  getRemoteName: jest.fn(),
  getBranchName: jest.fn(),
  createBranchLabel: jest.fn(),
  isBranchUpstream: jest.fn(),
  isCurrentBranchUpstream: jest.fn(),
  upstreamBranch: jest.fn(),
  push: jest.fn(),
}));

import { describe, test, expect, jest } from '@jest/globals';
import '@npmversion/jest-utils';
import {
  NotAGitProjectError,
  GitNotInstalledError,
} from '../../src/versioning/exception.js';
import { VersionOptions } from '../../src/config';

const {
  hasGitInstalled,
  hasGitProject,
  createBranch,
  createCommit,
  createTag,
} = await import('../../src/git');
const {
  checkForGitIfNeeded,
  createBranchGitIfNeeded,
  createCommitGitIfNeeded,
  createTagGitIfNeeded,
} = await import('../../src/versioning/git.js');

const DEFAULT_CWD = process.cwd();

describe('@npmversion/core - versioning/git', () => {
  describe('checkForGitIfNeeded', () => {
    test('should raise a specific error if no git is installed', async () => {
      // Arrange
      hasGitInstalled.mockResolvedValue(false);

      // Act && Assert
      await expect(
        checkForGitIfNeeded(new VersionOptions({ 'git-push': true })),
      ).rejects.toThrow(GitNotInstalledError);
    });

    test('should raise a specific error if we are not into a git project', async () => {
      // Arrange
      hasGitInstalled.mockResolvedValue(true);
      hasGitProject.mockResolvedValue(false);

      // Act && Assert
      await expect(
        checkForGitIfNeeded(new VersionOptions({ 'git-push': true })),
      ).rejects.toThrow(NotAGitProjectError);
    });

    test('should do nothing otherwise', async () => {
      // Arrange
      hasGitInstalled.mockResolvedValue(true);
      hasGitProject.mockResolvedValue(true);

      // Act & Assert
      await expect(
        checkForGitIfNeeded(new VersionOptions({ 'git-push': true })),
      ).resolves.toBeUndefined();
    });
  });

  describe('createBranchGitIfNeeded', () => {
    test('should not create the git commit', async () => {
      // Arrange
      const options = { preid: true };

      // Act
      await createBranchGitIfNeeded('1.2.3', options);

      // Assert
      expect(createBranch).not.toHaveBeenCalled();
    });

    describe('should create the commit git', () => {
      test('with the default message', async () => {
        // Arrange
        createBranch.mockResolvedValue();
        const options = new VersionOptions({
          preid: true,
          'git-create-branch': true,
        });

        // Act
        await createBranchGitIfNeeded('1.2.3', options);

        // Assert
        expect(createBranch).toHaveBeenCalledWith(
          '1.2.3',
          'release/%s',
          DEFAULT_CWD,
        );
      });

      test('with the specified message', async () => {
        // Arrange
        createBranch.mockResolvedValue();
        const options = new VersionOptions({
          preid: true,
          'git-create-branch': true,
          'git-branch-message': 'my custom message',
        });

        // Act
        await createBranchGitIfNeeded('1.2.3', options);

        // Assert
        expect(createBranch).toHaveBeenCalledWith(
          '1.2.3',
          'my custom message',
          DEFAULT_CWD,
        );
      });
    });
  });

  describe('createCommitGitIfNeeded', () => {
    test('should not create the git commit', async () => {
      // Arrange
      createCommit.mockResolvedValue();
      const options = new VersionOptions({
        preid: true,
        'nogit-commit': true,
      });

      // Act
      await createCommitGitIfNeeded('1.2.3', options);

      // Assert
      expect(createCommit).not.toHaveBeenCalled();
    });

    describe('should create the commit git', () => {
      test('with the default message', async () => {
        // Arrange
        createCommit.mockResolvedValue();
        const options = new VersionOptions({
          preid: true,
          'nogit-commit': false,
        });

        // Act
        await createCommitGitIfNeeded('1.2.3', options);

        // Assert
        expect(createCommit).toHaveBeenCalledWith(
          '1.2.3',
          'Release version: %s',
          DEFAULT_CWD,
        );
      });

      test('with the specified message', async () => {
        // Arrange
        createCommit.mockResolvedValue();
        const options = new VersionOptions({
          preid: true,
          'nogit-commit': false,
          'git-commit-message': 'my custom message',
        });

        // Act
        await createCommitGitIfNeeded('1.2.3', options);

        // Assert
        expect(createCommit).toHaveBeenCalledWith(
          '1.2.3',
          'my custom message',
          DEFAULT_CWD,
        );
      });
    });
  });

  describe('createTagGitIfNeeded', () => {
    test('should not create the git commit', async () => {
      // Arrange
      createTag.mockResolvedValue();
      const options = new VersionOptions({ preid: true, 'nogit-tag': true });

      // Act
      await createTagGitIfNeeded('1.2.3', options);

      // Assert
      expect(createTag).not.toHaveBeenCalled();
    });

    describe('should create the commit git', () => {
      test('with the default message', async () => {
        // Arrange
        createTag.mockResolvedValue();
        const options = new VersionOptions({ preid: true, 'nogit-tag': false });

        // Act
        await createTagGitIfNeeded('1.2.3', options);

        // Assert
        expect(createTag).toHaveBeenCalledWith('1.2.3', 'v%s', DEFAULT_CWD);
      });

      test('with the specified message', async () => {
        // Arrange
        createTag.mockResolvedValue();
        const options = new VersionOptions({
          preid: true,
          'nogit-tag': false,
          'git-tag-message': 'my custom message',
        });

        // Act
        await createTagGitIfNeeded('1.2.3', options);

        // Assert
        expect(createTag).toHaveBeenCalledWith(
          '1.2.3',
          'my custom message',
          DEFAULT_CWD,
        );
      });
    });
  });
});

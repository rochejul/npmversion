jest.unstable_mockModule('../src/npm/io.js', async () => ({
  spawn: jest.fn(),
}));

import { describe, test, expect, jest } from '@jest/globals';
import '@npmversion/jest-utils';

const { spawn } = await import('../../src/npm/io.js');
const {
  updateRoot,
  updateWorkspaceRoot,
  updateWorkspacePackage,
  updateDependencyForWorkspace,
  updateDependencyForRoot,
} = await import('../../src/npm/command.js');

const DEFAULT_CWD = process.cwd();

describe('@npmversion/workspace - npm/command', () => {
  describe('updateRoot', () => {
    test('generates the appropriate npm command', async () => {
      // Act
      await updateRoot('1.42.5');

      // Assert
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['version', '1.42.5', '--no-git-tag-version', '--allow-same-version'],
        DEFAULT_CWD,
      );
    });

    test('consumes the provided cwd', async () => {
      // Act
      await updateRoot('1.42.5', '/etc/shell');

      // Assert
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['version', '1.42.5', '--no-git-tag-version', '--allow-same-version'],
        '/etc/shell',
      );
    });
  });

  describe('updateWorkspaceRoot', () => {
    test('generates the appropriate npm command', async () => {
      // Act
      await updateWorkspaceRoot('1.42.5');

      // Assert
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'version',
          '1.42.5',
          '--include-workspace-root',
          '--no-git-tag-version',
          '--allow-same-version',
        ],
        DEFAULT_CWD,
      );
    });

    test('consumes the provided cwd', async () => {
      // Act
      await updateWorkspaceRoot('1.42.5', '/etc/shell');

      // Assert
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'version',
          '1.42.5',
          '--include-workspace-root',
          '--no-git-tag-version',
          '--allow-same-version',
        ],
        '/etc/shell',
      );
    });
  });

  describe('updateWorkspacePackage', () => {
    test('generates the appropriate npm command', async () => {
      // Act
      await updateWorkspacePackage('@example/some-package', '1.42.5');

      // Assert
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'version',
          '1.42.5',
          '--no-git-tag-version',
          '--allow-same-version',
          '--workspace=@example/some-package',
        ],
        DEFAULT_CWD,
      );
    });

    test('consumes the provided cwd', async () => {
      // Act
      await updateWorkspacePackage(
        '@example/some-package',
        '1.42.5',
        '/etc/shell',
      );

      // Assert
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'version',
          '1.42.5',
          '--no-git-tag-version',
          '--allow-same-version',
          '--workspace=@example/some-package',
        ],
        '/etc/shell',
      );
    });
  });

  describe('updateDependencyForWorkspace', () => {
    test('generates the appropriate npm command', async () => {
      // Act
      await updateDependencyForWorkspace(
        '@example/some-package',
        'none',
        '@example/util',
        '1.42.5',
      );

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '--workspace=@example/some-package', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'install',
          '--workspace=@example/some-package',
          '--save',
          '@example/util@1.42.5',
        ],
        DEFAULT_CWD,
      );
    });

    test('for dev dependencies', async () => {
      // Act
      await updateDependencyForWorkspace(
        '@example/some-package',
        'dev',
        '@example/util',
        '1.42.5',
      );

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '--workspace=@example/some-package', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'install',
          '--workspace=@example/some-package',
          '--save-dev',
          '@example/util@1.42.5',
        ],
        DEFAULT_CWD,
      );
    });

    test('for peer dependencies', async () => {
      // Act
      await updateDependencyForWorkspace(
        '@example/some-package',
        'peer',
        '@example/util',
        '1.42.5',
      );

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '--workspace=@example/some-package', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'install',
          '--workspace=@example/some-package',
          '--save-peer',
          '@example/util@1.42.5',
        ],
        DEFAULT_CWD,
      );
    });

    test('for optional dependencies', async () => {
      // Act
      await updateDependencyForWorkspace(
        '@example/some-package',
        'optional',
        '@example/util',
        '1.42.5',
      );

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '--workspace=@example/some-package', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'install',
          '--workspace=@example/some-package',
          '--save-optional',
          '@example/util@1.42.5',
        ],
        DEFAULT_CWD,
      );
    });

    test('consumes the provided cwd', async () => {
      // Act
      await updateDependencyForWorkspace(
        '@example/some-package',
        'none',
        '@example/util',
        '1.42.5',
        '/etc/shell',
      );

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '--workspace=@example/some-package', '@example/util'],
        '/etc/shell',
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'install',
          '--workspace=@example/some-package',
          '--save',
          '@example/util@1.42.5',
        ],
        '/etc/shell',
      );
    });
  });

  describe('updateDependencyForRoot', () => {
    test('generates the appropriate npm command', async () => {
      // Act
      await updateDependencyForRoot('none', '@example/util', '1.42.5');

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['install', '--save', '@example/util@1.42.5'],
        DEFAULT_CWD,
      );
    });

    test('for dev dependencies', async () => {
      // Act
      await updateDependencyForRoot('dev', '@example/util', '1.42.5');

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['install', '--save-dev', '@example/util@1.42.5'],
        DEFAULT_CWD,
      );
    });

    test('for peer dependencies', async () => {
      // Act
      await updateDependencyForRoot('peer', '@example/util', '1.42.5');

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['install', '--save-peer', '@example/util@1.42.5'],
        DEFAULT_CWD,
      );
    });

    test('for optional dependencies', async () => {
      // Act
      await updateDependencyForRoot('optional', '@example/util', '1.42.5');

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '@example/util'],
        DEFAULT_CWD,
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['install', '--save-optional', '@example/util@1.42.5'],
        DEFAULT_CWD,
      );
    });

    test('consumes the provided cwd', async () => {
      // Act
      await updateDependencyForRoot(
        'none',
        '@example/util',
        '1.42.5',
        '/etc/shell',
      );

      // Assert
      expect(spawn).toHaveBeenCalledTimes(2);
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['uninstall', '@example/util'],
        '/etc/shell',
      );
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        ['install', '--save', '@example/util@1.42.5'],
        '/etc/shell',
      );
    });
  });
});

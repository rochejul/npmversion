jest.unstable_mockModule('../src/npm/io.js', async () => ({
  spawn: jest.fn(),
}));

import { describe, test, expect, jest } from '@jest/globals';
import '@npmversion/jest-utils';

const { spawn } = await import('../../src/npm/io.js');
const { updateRoot, updateWorkspace, updateDependencyForRoot, pruning } =
  await import('../../src/npm/command.js');

describe('@npmversion/workspace - npm/command', () => {
  describe('pruning', () => {
    test('prunes the npm project', async () => {
      // Act
      await pruning('/etc/shell');

      // Assert
      expect(spawn).toHaveBeenCalledWith('npm', ['prune'], '/etc/shell');
    });
  });

  describe('updateRoot', () => {
    test('generates the appropriate npm command', async () => {
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

  describe('updateWorkspace', () => {
    test('generates the appropriate npm command', async () => {
      // Act
      await updateWorkspace('1.42.5', '/etc/shell');

      // Assert
      expect(spawn).toHaveBeenCalledWith(
        'npm',
        [
          'version',
          '1.42.5',
          '--no-git-tag-version',
          '--allow-same-version',
          '--include-workspace-root',
          '--workspaces',
        ],
        '/etc/shell',
      );
    });
  });

  describe('updateDependencyForRoot', () => {
    test('generates the appropriate npm command', async () => {
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

    test('for dev dependencies', async () => {
      // Act
      await updateDependencyForRoot(
        'dev',
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
        ['install', '--save-dev', '@example/util@1.42.5'],
        '/etc/shell',
      );
    });

    test('for peer dependencies', async () => {
      // Act
      await updateDependencyForRoot(
        'peer',
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
        ['install', '--save-peer', '@example/util@1.42.5'],
        '/etc/shell',
      );
    });

    test('for optional dependencies', async () => {
      // Act
      await updateDependencyForRoot(
        'optional',
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
        ['install', '--save-optional', '@example/util@1.42.5'],
        '/etc/shell',
      );
    });
  });
});

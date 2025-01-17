jest.unstable_mockModule('../src/npm/command.js', async () => ({
  updateRoot: jest.fn(),
  updateWorkspace: jest.fn(),
  updateDependencyForWorkspace: jest.fn(),
  updateDependencyForRoot: jest.fn(),
  DEPENDENCY_LEVEL: {
    none: 'none',
    peer: 'peer',
    optional: 'optional',
    dev: 'dev',
  },
}));

jest.unstable_mockModule('@npmversion/util', async () => ({
  loadPackageJson: jest.fn(),
  promisedExec: jest.fn(),
  readFile: jest.fn(),
}));

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import '@npmversion/jest-utils';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const { loadPackageJson } = await import('@npmversion/util');
const {
  updateRoot,
  updateWorkspace,
  updateDependencyForWorkspace,
  updateDependencyForRoot,
} = await import('../../src/npm/command.js');
const { updatePackageVersion } = await import('../../src/index.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const leafWorkspacePath = path.resolve(
  path.join(__dirname, '../resources/packages/workspace'),
);
const treeWorkspacePath = path.resolve(path.join(__dirname, '../resources'));

describe('@npmversion/workspace - npm', () => {
  let npmCommands;

  beforeEach(() => {
    npmCommands = [];

    updateRoot.mockImplementation((...args) => {
      npmCommands.push(['updateRoot', ...args]);
      return Promise.resolve();
    });

    updateWorkspace.mockImplementation((...args) => {
      npmCommands.push(['updateWorkspace', ...args]);
      return Promise.resolve();
    });

    updateDependencyForWorkspace.mockImplementation((...args) => {
      npmCommands.push(['updateDependencyForWorkspace', ...args]);
      return Promise.resolve();
    });

    updateDependencyForRoot.mockImplementation((...args) => {
      npmCommands.push(['updateDependencyForRoot', ...args]);
      return Promise.resolve();
    });
  });

  describe('updatePackageVersion', () => {
    test('update the npm version when leaf case', async () => {
      // Arrange
      const packageJSON = await import(`${leafWorkspacePath}/package.json`);
      loadPackageJson.mockResolvedValue({
        ...packageJSON.default,
        isLeaf() {
          return true;
        },
      });

      // Act
      await updatePackageVersion('1.42.5', leafWorkspacePath);

      // Assert
      expect(npmCommands).toStrictEqual([
        ['updateRoot', '1.42.5', leafWorkspacePath],
      ]);
    });

    test('update the npm version when workspace case', async () => {
      // Arrange
      const packageJSON = await import(`${treeWorkspacePath}/package.json`);
      loadPackageJson.mockResolvedValue({
        ...packageJSON.default,
        isLeaf() {
          return false;
        },
      });

      // Act
      await updatePackageVersion('1.42.5', treeWorkspacePath);

      // Assert
      expect(npmCommands).toStrictEqual([
        ['updateWorkspace', '1.42.5', treeWorkspacePath],
        [
          'updateDependencyForWorkspace',
          '@npmversion/workspace',
          'none',
          '@npmversion/util',
          '1.42.5',
          treeWorkspacePath,
        ],
        [
          'updateDependencyForWorkspace',
          '@npmversion/core',
          'none',
          '@npmversion/util',
          '1.42.5',
          treeWorkspacePath,
        ],
        [
          'updateDependencyForWorkspace',
          '@npmversion/core',
          'none',
          '@npmversion/workspace',
          '1.42.5',
          treeWorkspacePath,
        ],
        [
          'updateDependencyForWorkspace',
          '@npmversion/cli',
          'none',
          '@npmversion/core',
          '1.42.5',
          treeWorkspacePath,
        ],
        [
          'updateDependencyForRoot',
          'none',
          '@npmversion/cli',
          '1.42.5',
          treeWorkspacePath,
        ],
      ]);
    });
  });
});

const mockNpmPackageJsonUpdate = jest.fn();

jest.unstable_mockModule('@npmcli/package-json', async () => ({
  default: {
    async load(path) {
      const packageJson = await import(`${path}/package.json`);

      return {
        content: packageJson,
        update: mockNpmPackageJsonUpdate,
        save: jest.fn(),
      };
    },
  },
}));

jest.unstable_mockModule('../src/npm/command.js', async () => ({
  updateRoot: jest.fn(),
  updateWorkspace: jest.fn(),
  updateDependencyForWorkspace: jest.fn(),
  updateDependencyForRoot: jest.fn(),
  pruning: jest.fn(),
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
const { updateRoot, updateWorkspace, updateDependencyForRoot, pruning } =
  await import('../../src/npm/command.js');
const { updatePackageVersion } = await import('../../src/index.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const treeWorkspacePath = path.resolve(
  path.join(__dirname, '../resources/usecase1_usual_flow'),
);
const leafWorkspacePath = path.resolve(
  path.join(treeWorkspacePath, './packages/workspace'),
);
const treeSideCasesWorkspacePath = path.resolve(
  path.join(__dirname, '../resources/usecase2_target_uncovered_flows'),
);

describe('@example/workspace - npm', () => {
  let npmCommands;

  beforeEach(() => {
    npmCommands = [];

    updateRoot.mockImplementation((...args) => {
      npmCommands.push(['updateRoot', ...args]);
      return Promise.resolve();
    });

    mockNpmPackageJsonUpdate.mockImplementation((...args) => {
      npmCommands.push(['npmCliUpdate', ...args]);
      return Promise.resolve();
    });

    updateWorkspace.mockImplementation((...args) => {
      npmCommands.push(['updateWorkspace', ...args]);
      return Promise.resolve();
    });

    updateDependencyForRoot.mockImplementation((...args) => {
      npmCommands.push(['updateDependencyForRoot', ...args]);
      return Promise.resolve();
    });

    pruning.mockImplementation((...args) => {
      npmCommands.push(['pruning', ...args]);
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
          'npmCliUpdate',
          {
            dependencies: {
              '@example/util': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            dependencies: {
              '@example/util': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            dependencies: {
              '@example/workspace': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            peerDependencies: {
              '@example/core': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            optionalDependencies: {
              '@example/core': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            devDependencies: {
              '@example/core': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            dependencies: {
              '@example/core': '1.42.5',
            },
          },
        ],
        ['pruning', treeWorkspacePath],
        [
          'updateDependencyForRoot',
          'none',
          '@example/cli',
          '1.42.5',
          treeWorkspacePath,
        ],
      ]);
    });

    test('update the npm version when workspace case and ensure to satisfies the dependency range', async () => {
      // Arrange
      const packageJSON = await import(
        `${treeSideCasesWorkspacePath}/package.json`
      );
      loadPackageJson.mockResolvedValue({
        ...packageJSON.default,
        isLeaf() {
          return false;
        },
      });

      // Act
      await updatePackageVersion('1.42.5', treeSideCasesWorkspacePath);

      // Assert
      expect(npmCommands).toStrictEqual([
        ['updateWorkspace', '1.42.5', treeSideCasesWorkspacePath],
        [
          'npmCliUpdate',
          {
            dependencies: {
              '@example2/util': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            dependencies: {
              '@example2/util': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            dependencies: {
              '@example2/workspace': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            peerDependencies: {
              '@example2/core': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            devDependencies: {
              '@example2/core': '1.42.5',
            },
          },
        ],
        [
          'npmCliUpdate',
          {
            dependencies: {
              '@example2/core': '1.42.5',
            },
          },
        ],
        ['pruning', treeSideCasesWorkspacePath],
        [
          'updateDependencyForRoot',
          'dev',
          '@example2/core',
          '1.42.5',
          treeSideCasesWorkspacePath,
        ],
        [
          'updateDependencyForRoot',
          'none',
          '@example2/cli',
          '1.42.5',
          treeSideCasesWorkspacePath,
        ],
      ]);
    });
  });
});

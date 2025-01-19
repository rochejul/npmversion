import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { computeWorkspace } from '../src/index.js';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const treeWorkspacePath = path.resolve(
  path.join(__dirname, './resources/usecase1_usual_flow'),
);

describe('@npmversion/workspace - workspace', () => {
  describe('computeWorkspace', () => {
    test('returns empty array if we are in a leaf module', async () => {
      // Act
      const workspace = await computeWorkspace(
        path.resolve(path.join(treeWorkspacePath, './packages/workspace')),
      );

      // Assert
      expect(workspace).toMatchPlainObject({
        name: '@example/workspace',
        version: '2.0.0',
        workspacePackages: [],
        dependencies: [
          {
            name: '@example/util',
            range: '2.0.0',
          },
        ],
        devDependencies: [],
        peerDependencies: [
          {
            name: '@example/jest-utils',
            range: '*',
          },
        ],
        optionalDependencies: [],
      });
    });

    test('returns the packages array if we are in a root module', async () => {
      // Act
      const workspace = await computeWorkspace(treeWorkspacePath);

      // Assert
      expect(workspace).toMatchPlainObject({
        name: 'example',
        version: '2.0.0',
        workspacePackages: [
          {
            rootDir: `${treeWorkspacePath}/packages/cli`,
            name: '@example/cli',
            version: '2.0.0',
            dependencies: [
              {
                name: '@example/core',
                range: '2.0.0',
              },
            ],
            devDependencies: [
              {
                name: '@example/core',
                range: '2.0.0',
              },
            ],
            peerDependencies: [
              {
                name: '@example/core',
                range: '2.0.0',
              },
              {
                name: '@example/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [
              {
                name: '@example/core',
                range: '2.0.0',
              },
            ],
          },
          {
            rootDir: `${treeWorkspacePath}/packages/core`,
            name: '@example/core',
            version: '2.0.0',
            dependencies: [
              {
                name: '@example/util',
                range: '2.0.0',
              },
              {
                name: '@example/workspace',
                range: '2.0.0',
              },
            ],
            devDependencies: [],
            peerDependencies: [
              {
                name: '@example/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [],
          },
          {
            rootDir: `${treeWorkspacePath}/packages/jest-utils`,
            name: '@example/jest-utils',
            version: '2.0.0',
            dependencies: [],
            devDependencies: [],
            peerDependencies: [],
            optionalDependencies: [],
          },
          {
            rootDir: `${treeWorkspacePath}/packages/util`,
            name: '@example/util',
            version: '2.0.0',
            dependencies: [],
            devDependencies: [],
            peerDependencies: [
              {
                name: '@example/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [],
          },
          {
            rootDir: `${treeWorkspacePath}/packages/workspace`,
            name: '@example/workspace',
            version: '2.0.0',
            dependencies: [
              {
                name: '@example/util',
                range: '2.0.0',
              },
            ],
            devDependencies: [],
            peerDependencies: [
              {
                name: '@example/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [],
          },
        ],
        dependencies: [
          {
            name: '@example/cli',
            range: '2.0.0',
          },
        ],
        devDependencies: [],
        peerDependencies: [],
        optionalDependencies: [],
      });
    });

    test('returns the dependencies order if we are in a root module', async () => {
      // Act
      const workspace = await computeWorkspace(treeWorkspacePath);

      // Assert
      expect(workspace.dependenciesOrder()).toStrictEqual([
        '@example/jest-utils',
        '@example/util',
        '@example/workspace',
        '@example/core',
        '@example/cli',
      ]);
    });
  });
});

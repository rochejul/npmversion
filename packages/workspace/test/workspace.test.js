import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { computeWorkspace } from '../src/index.js';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('@npmversion/workspace - workspace', () => {
  describe('computeWorkspace', () => {
    test('returns empty array if we are in a leaf module', async () => {
      // Act
      const workspace = await computeWorkspace(
        path.resolve(path.join(__dirname, './resources/packages/workspace')),
      );

      // Assert
      expect(workspace).toMatchPlainObject({
        name: '@npmversion/workspace',
        version: '2.0.0',
        workspacePackages: [],
        dependencies: [
          {
            name: '@npmversion/util',
            range: '2.0.0',
          },
        ],
        devDependencies: [],
        peerDependencies: [
          {
            name: '@npmversion/jest-utils',
            range: '*',
          },
        ],
        optionalDependencies: [],
      });
    });

    test('returns the packages array if we are in a root module', async () => {
      // Act
      const workspace = await computeWorkspace(
        path.resolve(path.join(__dirname, './resources')),
      );

      // Assert
      expect(workspace).toMatchPlainObject({
        name: 'npmversion',
        version: '2.0.0',
        dependencies: [
          {
            name: '@npmversion/cli',
            range: '2.0.0',
          },
        ],
        devDependencies: [],
        peerDependencies: [],
        optionalDependencies: [],
        workspacePackages: [
          {
            name: '@npmversion/cli',
            version: '2.0.0',
            dependencies: [
              {
                name: '@npmversion/core',
                range: '2.0.0',
              },
            ],
            devDependencies: [],
            peerDependencies: [
              {
                name: '@npmversion/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [],
          },
          {
            name: '@npmversion/core',
            version: '2.0.0',
            dependencies: [
              {
                name: '@npmversion/util',
                range: '2.0.0',
              },
              {
                name: '@npmversion/workspace',
                range: '2.0.0',
              },
            ],
            devDependencies: [],
            peerDependencies: [
              {
                name: '@npmversion/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [],
          },
          {
            name: '@npmversion/jest-utils',
            version: '2.0.0',
            dependencies: [],
            devDependencies: [],
            peerDependencies: [],
            optionalDependencies: [],
          },
          {
            name: '@npmversion/util',
            version: '2.0.0',
            dependencies: [],
            devDependencies: [],
            peerDependencies: [
              {
                name: '@npmversion/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [],
          },
          {
            name: '@npmversion/workspace',
            version: '2.0.0',
            dependencies: [
              {
                name: '@npmversion/util',
                range: '2.0.0',
              },
            ],
            devDependencies: [],
            peerDependencies: [
              {
                name: '@npmversion/jest-utils',
                range: '*',
              },
            ],
            optionalDependencies: [],
          },
        ],
      });
    });

    test('returns the dependencies order if we are in a root module', async () => {
      // Act
      const workspace = await computeWorkspace(
        path.resolve(path.join(__dirname, './resources')),
      );

      // Assert
      expect(workspace.dependenciesOrder()).toStrictEqual([
        '@npmversion/jest-utils',
        '@npmversion/util',
        '@npmversion/workspace',
        '@npmversion/core',
        '@npmversion/cli',
      ]);
    });
  });
});

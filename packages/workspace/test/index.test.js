import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { computeWorkspace } from '../src/index.js';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('@npmversion/workspace - index', () => {
  describe('computeWorkspace', () => {
    test('returns empty array if we are in a leaf module', async () => {
      const workspace = await computeWorkspace(
        path.resolve(path.join(__dirname, '..')),
      );

      expect(workspace).toMatchPlainObject({
        name: '@npmversion/workspace',
        version: '2.0.0',
        workspacePackages: [],
      });
    });

    test('returns the packages array if we are in a root module', async () => {
      const workspace = await computeWorkspace(
        path.resolve(path.join(__dirname, './resources')),
      );

      expect(workspace).toMatchPlainObject({
        name: 'npmversion',
        version: '2.0.0',
        workspacePackages: [
          {
            name: '@npmversion/cli',
            version: '2.0.0',
            dependencies: ['@npmversion/core'],
            devDependencies: [],
            peerDependencies: ['@npmversion/jest-utils'],
            optionalDependencies: [],
          },
          {
            name: '@npmversion/core',
            version: '2.0.0',
            dependencies: ['@npmversion/util', '@npmversion/workspace'],
            devDependencies: [],
            peerDependencies: ['@npmversion/jest-utils'],
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
            peerDependencies: ['@npmversion/jest-utils'],
            optionalDependencies: [],
          },
          {
            name: '@npmversion/workspace',
            version: '2.0.0',
            dependencies: ['@npmversion/util'],
            devDependencies: [],
            peerDependencies: ['@npmversion/jest-utils'],
            optionalDependencies: [],
          },
        ],
      });
    });
  });
});

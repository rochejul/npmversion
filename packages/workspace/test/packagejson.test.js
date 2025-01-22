jest.unstable_mockModule('@npmcli/package-json', async () => ({
  default: {
    async load(path) {
      const packageJson = await import(`${path}/package.json`);

      return {
        content: packageJson,
        update: jest.fn(),
        save: jest.fn(),
      };
    },
  },
}));

import { describe, test, expect, jest } from '@jest/globals';
import '@npmversion/jest-utils';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { loadPackageJson, PartialPackageJson } = await import(
  '../src/packageJson/index.js'
);

describe('@npmversion/workspace - packagejson', () => {
  describe('loadPackageJson', () => {
    test('returns the content of the package.json file in a model', async () => {
      // Act
      const packageJson = await loadPackageJson(
        path.resolve(path.join(__dirname, './resources/packagejson/leaf')),
      );

      // Assert
      expect(packageJson).toBeInstanceOf(PartialPackageJson);
    });

    test('returns the content of the package.json file when we are a package', async () => {
      // Act
      const packageJson = await loadPackageJson(
        path.resolve(path.join(__dirname, './resources/packagejson/leaf')),
      );

      // Assert
      expect(packageJson).toMatchPlainObject({
        name: '@myModule/leaf',
        version: '2.0.0',
        workspaces: [],
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
        optionalDependencies: {},
      });
    });

    test('returns the content of the package.json file when we are at the root leve', async () => {
      const packageJson = await loadPackageJson(
        path.resolve(path.join(__dirname, './resources/packagejson/root')),
      );

      expect(packageJson).toMatchPlainObject({
        name: 'myModule',
        version: '2.0.0',
        workspaces: ['packages/*'],
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
        optionalDependencies: {},
      });
    });
  });
});

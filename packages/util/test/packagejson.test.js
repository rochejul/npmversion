import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { loadPackageJson, PackageJson } from '../src/packagejson';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('@npmversion/util - packagejson', () => {
  describe('loadPackageJson', () => {
    test('returns the content of the package.json file in a model', async () => {
      // Act
      const packageJson = await loadPackageJson(
        path.resolve(path.join(__dirname, './resources/packagejson/leaf')),
      );

      // Assert
      expect(packageJson).toBeInstanceOf(PackageJson);
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

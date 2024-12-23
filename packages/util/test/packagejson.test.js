import { describe, test, expect, jest } from '@jest/globals';
import { plainObject } from '@npmversion/jest-utils';
import { loadPackageJson, PackageJson } from '../src/packagejson.js';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('@npmversion/util - packagejson', () => {
  describe('loadPackageJson', () => {
    test('returns the content of the package.json file in a model', async () => {
      const packageJson = await loadPackageJson(
        path.resolve(path.join(__dirname, './resources/packagejson/leaf')),
      );

      expect(packageJson).toBeInstanceOf(PackageJson);
    });

    test('returns the content of the package.json file when we are a package', async () => {
      const packageJson = await loadPackageJson(
        path.resolve(path.join(__dirname, './resources/packagejson/leaf')),
      );

      expect(plainObject(packageJson)).toEqual({
        name: '@myModule/leaf',
        version: '2.0.0',
        workspaces: undefined,
      });
    });

    test('returns the content of the package.json file when we are at the root leve', async () => {
      const packageJson = await loadPackageJson(
        path.resolve(path.join(__dirname, './resources/packagejson/root')),
      );

      expect(plainObject(packageJson)).toEqual({
        name: 'myModule',
        version: '2.0.0',
        workspaces: ['packages/*'],
      });
    });
  });
});

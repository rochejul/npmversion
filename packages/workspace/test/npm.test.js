jest.unstable_mockModule('@npmversion/util', async () => ({
  loadPackageJson: jest.fn(),
  promisedExec: jest.fn(),
  readFile: jest.fn(),
}));

import { describe, test, expect, jest } from '@jest/globals';
import '@npmversion/jest-utils';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const { loadPackageJson, promisedExec } = await import('@npmversion/util');
const { updatePackageVersion } = await import('../src/index.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const leafWorkspacePath = path.resolve(
  path.join(__dirname, './resources/packages/workspace'),
);
const treeWorkspacePath = path.resolve(path.join(__dirname, './resources'));

describe('@npmversion/workspace - npm', () => {
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
      expect(promisedExec).toHaveBeenCalledTimes(1);
      expect(promisedExec).toHaveBeenCalledWith(
        'npm version 1.42.5 --no-git-tag-version --allow-same-version',
        false,
        leafWorkspacePath,
      );
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
      expect(promisedExec).toHaveBeenCalledTimes(10);
      expect(promisedExec).toHaveBeenCalledWith(
        'npm version 1.42.5 --no-git-tag-version --allow-same-version --workspace=@npmversion/jest-utils',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm version 1.42.5 --no-git-tag-version --allow-same-version --workspace=@npmversion/util',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm version 1.42.5 --no-git-tag-version --allow-same-version --workspace=@npmversion/workspace',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm version 1.42.5 --no-git-tag-version --allow-same-version --workspace=@npmversion/core',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm version 1.42.5 --no-git-tag-version --allow-same-version --workspace=@npmversion/cli',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm install --force --workspace=@npmversion/workspace --save @npmversion/util@1.42.5',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm install --force --workspace=@npmversion/core --save @npmversion/util@1.42.5',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm install --force --workspace=@npmversion/core --save @npmversion/workspace@1.42.5',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm install --force --workspace=@npmversion/cli --save @npmversion/core@1.42.5',
        false,
        treeWorkspacePath,
      );
      expect(promisedExec).toHaveBeenCalledWith(
        'npm version 1.42.5 --include-workspace-root --no-git-tag-version --allow-same-version',
        false,
        treeWorkspacePath,
      );
    });
  });
});

import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { WorkspacePackageDependency } from '../src/model';

describe('@npmversion/workspace - model', () => {
  describe('WorkspacePackageDependency', () => {
    test('statisfies should return true if the range is aligned with the version (strict equals)', async () => {
      // Arrange
      const dep = new WorkspacePackageDependency({
        name: 'some name',
        range: '2.0.0',
      });

      // Act
      const actual = dep.satisfies('2.0.0');

      // Assert
      expect(actual).toBeTruthy();
    });

    test('statisfies should return true if the range is aligned with the version (X token)', async () => {
      // Arrange
      const dep = new WorkspacePackageDependency({
        name: 'some name',
        range: '2.x',
      });

      // Act
      const actual = dep.satisfies('2.0.0');

      // Assert
      expect(actual).toBeTruthy();
    });

    test('statisfies should return true if the range is aligned with the version (greather than)', async () => {
      // Arrange
      const dep = new WorkspacePackageDependency({
        name: 'some name',
        range: '>= 2.x',
      });

      // Act
      const actual = dep.satisfies('2.0.0');

      // Assert
      expect(actual).toBeTruthy();
    });

    test('statisfies should return true if the range is aligned with the version (any)', async () => {
      // Arrange
      const dep = new WorkspacePackageDependency({
        name: 'some name',
        range: '*',
      });

      // Act
      const actual = dep.satisfies('2.0.0');

      // Assert
      expect(actual).toBeTruthy();
    });

    test('statisfies should return false otherwise', async () => {
      // Arrange
      const dep = new WorkspacePackageDependency({
        name: 'some name',
        range: '>= 2.X',
      });

      // Act
      const actual = dep.satisfies('1.9.9');

      // Assert
      expect(actual).toBeFalsy();
    });
  });
});

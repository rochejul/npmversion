import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { getIncrementationLevel } from '../../src/versioning/level';

describe('@npmversion/core - versioning/level', () => {
  describe('getIncrementationLevel', () => {
    test('should return patch if no options are provided', () => {
      // Act & Assert
      expect(getIncrementationLevel()).toBe('patch');
    });

    test('should return patch if no increment level is specified', () => {
      // Act & Assert
      expect(getIncrementationLevel({})).toBe('patch');
    });

    test('should return patch if the increment level is not recognized', () => {
      // Act & Assert
      expect(getIncrementationLevel({ increment: 'fake' })).toBe('patch');
    });

    describe('should the specified level ', () => {
      const scenariiWithCasesChecking = [
        ['major', 'major'],
        ['minor', 'minor'],
        ['patch', 'patch'],
        ['premajor', 'premajor'],
        ['preminor', 'preminor'],
        ['prepatch', 'prepatch'],
        ['prerelease', 'prerelease'],
      ];
      test.each(scenariiWithCasesChecking)(
        'with cases checking (%s -> %s)',
        (increment, expected) => {
          // Act & Assert
          expect(getIncrementationLevel({ increment })).toBe(expected);
        },
      );

      const scenariiWithoutCasesChecking = [
        ['MAJOR', 'major'],
        ['MINOR', 'minor'],
        ['PATCH', 'patch'],
        ['PREMAJOR', 'premajor'],
        ['PREMINOR', 'preminor'],
        ['PREPATCH', 'prepatch'],
        ['PRERELEASE', 'prerelease'],
      ];
      test.each(scenariiWithoutCasesChecking)(
        'without cases checking (%s -> %s)',
        (increment, expected) => {
          // Act & Assert
          expect(getIncrementationLevel({ increment })).toBe(expected);
        },
      );
    });
  });
});

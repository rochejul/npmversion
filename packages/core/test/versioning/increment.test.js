import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import {
  unpreidPackageVersion,
  incrementPackageVersion,
} from '../../src/versioning/increment';

describe('@npmversion/core - versioning/increment', () => {
  describe('unpreidPackageVersion', () => {
    test('should do nothing if no preid is detected', () => {
      // Act & Assert
      expect(unpreidPackageVersion('1.2.3')).toBe('1.2.3');
    });

    describe('should do something', () => {
      test('if prerelease / prepatch is detected', () => {
        // Act & Assert
        expect(unpreidPackageVersion('1.2.4-0')).toBe('1.2.4');
      });

      test('if preminor is detected', () => {
        // Act & Assert
        expect(unpreidPackageVersion('1.3.0-0')).toBe('1.3.0');
      });

      test('if premajor is detected', () => {
        // Act & Assert
        expect(unpreidPackageVersion('2.0.0-0')).toBe('2.0.0');
      });

      test('if prerelease / prepatch with flag is detected', () => {
        // Act & Assert
        expect(unpreidPackageVersion('1.2.4-beta.0')).toBe('1.2.4');
      });

      test('if preminor with flag is detected', () => {
        // Act & Assert
        expect(unpreidPackageVersion('1.3.0-beta.0')).toBe('1.3.0');
      });

      test('if premajor with flag is detected', () => {
        // Act & Assert
        expect(unpreidPackageVersion('2.0.0-beta.0')).toBe('2.0.0');
      });
    });
  });

  describe('incrementPackageVersion', () => {
    describe('should classicaly increment with the following options:', () => {
      describe('basics -', () => {
        test('1.2.3 --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'patch')).toBe('1.2.4');
        });

        test('1.2.3 --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'minor')).toBe('1.3.0');
        });

        test('1.2.3 --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'major')).toBe('2.0.0');
        });

        test('1.2.3 --increment prerelease', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'prerelease')).toBe(
            '1.2.4-0',
          );
        });

        test('1.2.3 --increment prepatch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'prepatch')).toBe('1.2.4-0');
        });

        test('1.2.3 --increment preminor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'preminor')).toBe('1.3.0-0');
        });

        test('1.2.3 --increment premajor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'premajor')).toBe('2.0.0-0');
        });
      });

      describe('with prenumber -', () => {
        test('1.2.3-0 --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'patch')).toBe('1.2.3');
        });

        test('1.2.3-0 --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'minor')).toBe('1.3.0');
        });

        test('1.2.3-0 --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'major')).toBe('2.0.0');
        });

        test('1.2.3-0 --increment prerelease', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'prerelease')).toBe(
            '1.2.3-1',
          );
        });

        test('1.2.3-0 --increment prepatch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'prepatch')).toBe(
            '1.2.4-0',
          );
        });

        test('1.2.3-0 --increment preminor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'preminor')).toBe(
            '1.3.0-0',
          );
        });

        test('1.2.3-0 --increment premajor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'premajor')).toBe(
            '2.0.0-0',
          );
        });
      });

      describe('with preid -', () => {
        test('1.2.3-beta --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'patch')).toBe('1.2.3');
        });

        test('1.2.3-beta --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'minor')).toBe('1.3.0');
        });

        test('1.2.3-beta --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'major')).toBe('2.0.0');
        });

        test('1.2.3-beta --increment prerelease', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'prerelease')).toBe(
            '1.2.3-beta.0',
          );
        });

        test('1.2.3-beta --increment prepatch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'prepatch')).toBe(
            '1.2.4-0',
          );
        });

        test('1.2.3-beta --increment preminor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'preminor')).toBe(
            '1.3.0-0',
          );
        });

        test('1.2.3-beta --increment premajor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'premajor')).toBe(
            '2.0.0-0',
          );
        });
      });

      describe('with prenumber and preid -', () => {
        test('1.2.3-beta.0 --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'patch')).toBe(
            '1.2.3',
          );
        });

        test('1.2.3-beta.0 --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'minor')).toBe(
            '1.3.0',
          );
        });

        test('1.2.3-beta.0 --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'major')).toBe(
            '2.0.0',
          );
        });

        test('1.2.3-beta.0 --increment prerelease', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'prerelease')).toBe(
            '1.2.3-beta.1',
          );
        });

        test('1.2.3-beta.0 --increment prepatch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'prepatch')).toBe(
            '1.2.4-0',
          );
        });

        test('1.2.3-beta.0 --increment preminor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'preminor')).toBe(
            '1.3.0-0',
          );
        });

        test('1.2.3-beta.0 --increment premajor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'premajor')).toBe(
            '2.0.0-0',
          );
        });
      });
    });

    describe('should classicaly increment with the following options (where a preid flag to "beta" is set):', () => {
      describe('basics -', () => {
        test('1.2.3 --preid beta --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'patch', 'beta')).toBe(
            '1.2.4',
          );
        });

        test('1.2.3 --preid beta --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'minor', 'beta')).toBe(
            '1.3.0',
          );
        });

        test('1.2.3 --preid beta --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'major', 'beta')).toBe(
            '2.0.0',
          );
        });

        test('1.2.3 --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'prerelease', 'beta')).toBe(
            '1.2.4-beta.0',
          );
        });

        test('1.2.3 --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'prepatch', 'beta')).toBe(
            '1.2.4-beta.0',
          );
        });

        test('1.2.3 --preid beta --increment preminor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'preminor', 'beta')).toBe(
            '1.3.0-beta.0',
          );
        });

        test('1.2.3 --preid beta --increment premajor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'premajor', 'beta')).toBe(
            '2.0.0-beta.0',
          );
        });
      });

      describe('with prenumber -', () => {
        test('1.2.3-0 --preid beta --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'patch', 'beta')).toBe(
            '1.2.3',
          );
        });

        test('1.2.3-0 --preid beta --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'minor', 'beta')).toBe(
            '1.3.0',
          );
        });

        test('1.2.3-0 --preid beta --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'major', 'beta')).toBe(
            '2.0.0',
          );
        });

        test('1.2.3-0 --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'prerelease', 'beta')).toBe(
            '1.2.3-beta.0',
          );
        });

        test('1.2.3-0 --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'prepatch', 'beta')).toBe(
            '1.2.4-beta.0',
          );
        });

        test('1.2.3-0 --preid beta --increment preminor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'preminor', 'beta')).toBe(
            '1.3.0-beta.0',
          );
        });

        test('1.2.3-0 --preid beta --increment premajor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-0', 'premajor', 'beta')).toBe(
            '2.0.0-beta.0',
          );
        });
      });

      describe('with preid -', () => {
        test('1.2.3-beta --preid beta --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'patch', 'beta')).toBe(
            '1.2.3',
          );
        });

        test('1.2.3-beta --preid beta --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'minor', 'beta')).toBe(
            '1.3.0',
          );
        });

        test('1.2.3-beta --preid beta --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta', 'major', 'beta')).toBe(
            '2.0.0',
          );
        });

        test('1.2.3-beta --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'prerelease', 'beta'),
          ).toBe('1.2.3-beta.0');
        });

        test('1.2.3-beta --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'prepatch', 'beta'),
          ).toBe('1.2.4-beta.0');
        });

        test('1.2.3-beta --preid beta --increment preminor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'preminor', 'beta'),
          ).toBe('1.3.0-beta.0');
        });

        test('1.2.3-beta --preid beta --increment premajor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'premajor', 'beta'),
          ).toBe('2.0.0-beta.0');
        });
      });

      describe('with prenumber and preid -', () => {
        test('1.2.3-beta.0 --preid beta --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'patch', 'beta')).toBe(
            '1.2.3',
          );
        });

        test('1.2.3-beta.0 --preid beta --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'minor', 'beta')).toBe(
            '1.3.0',
          );
        });

        test('1.2.3-beta.0 --preid beta --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3-beta.0', 'major', 'beta')).toBe(
            '2.0.0',
          );
        });

        test('1.2.3-beta.0 --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'prerelease', 'beta'),
          ).toBe('1.2.3-beta.1');
        });

        test('1.2.3-beta.0 --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'prepatch', 'beta'),
          ).toBe('1.2.4-beta.0');
        });

        test('1.2.3-beta.0 --preid beta --increment preminor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'preminor', 'beta'),
          ).toBe('1.3.0-beta.0');
        });

        test('1.2.3-beta.0 --preid beta --increment premajor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'premajor', 'beta'),
          ).toBe('2.0.0-beta.0');
        });
      });
    });

    describe('should increment with the following options (where a preid flag to "beta" is set) and where we force to add the preid if needed:', () => {
      describe('basics -', () => {
        test('1.2.3 --preid beta --increment patch', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'patch', 'beta', true)).toBe(
            '1.2.4-beta',
          );
        });

        test('1.2.3 --preid beta --increment minor', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'minor', 'beta', true)).toBe(
            '1.3.0-beta',
          );
        });

        test('1.2.3 --preid beta --increment major', () => {
          // Act & Assert
          expect(incrementPackageVersion('1.2.3', 'major', 'beta', true)).toBe(
            '2.0.0-beta',
          );
        });

        test('1.2.3 --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3', 'prerelease', 'beta', true),
          ).toBe('1.2.4-beta.0');
        });

        test('1.2.3 --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3', 'prepatch', 'beta', true),
          ).toBe('1.2.4-beta.0');
        });

        test('1.2.3 --preid beta --increment preminor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3', 'preminor', 'beta', true),
          ).toBe('1.3.0-beta.0');
        });

        test('1.2.3 --preid beta --increment premajor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3', 'premajor', 'beta', true),
          ).toBe('2.0.0-beta.0');
        });
      });

      describe('with prenumber -', () => {
        test('1.2.3-0 --preid beta --increment patch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-0', 'patch', 'beta', true),
          ).toBe('1.2.3-beta');
        });

        test('1.2.3-0 --preid beta --increment minor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-0', 'minor', 'beta', true),
          ).toBe('1.3.0-beta');
        });

        test('1.2.3-0 --preid beta --increment major', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-0', 'major', 'beta', true),
          ).toBe('2.0.0-beta');
        });

        test('1.2.3-0 --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-0', 'prerelease', 'beta', true),
          ).toBe('1.2.3-beta.0');
        });

        test('1.2.3-0 --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-0', 'prepatch', 'beta', true),
          ).toBe('1.2.4-beta.0');
        });

        test('1.2.3-0 --preid beta --increment preminor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-0', 'preminor', 'beta', true),
          ).toBe('1.3.0-beta.0');
        });

        test('1.2.3-0 --preid beta --increment premajor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-0', 'premajor', 'beta', true),
          ).toBe('2.0.0-beta.0');
        });
      });

      describe('with preid -', () => {
        test('1.2.3-beta --preid beta --increment patch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'patch', 'beta', true),
          ).toBe('1.2.4-beta');
        });

        test('1.2.3-beta --preid beta --increment minor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'minor', 'beta', true),
          ).toBe('1.3.0-beta');
        });

        test('1.2.3-beta --preid beta --increment major', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'major', 'beta', true),
          ).toBe('2.0.0-beta');
        });

        test('1.2.3-beta --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'prerelease', 'beta', true),
          ).toBe('1.2.3-beta.0');
        });

        test('1.2.3-beta --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'prepatch', 'beta', true),
          ).toBe('1.2.4-beta.0');
        });

        test('1.2.3-beta --preid beta --increment preminor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'preminor', 'beta', true),
          ).toBe('1.3.0-beta.0');
        });

        test('1.2.3-beta --preid beta --increment premajor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta', 'premajor', 'beta', true),
          ).toBe('2.0.0-beta.0');
        });
      });

      describe('with prenumber and preid -', () => {
        test('1.2.3-beta.0 --preid beta --increment patch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'patch', 'beta', true),
          ).toBe('1.2.4-beta');
        });

        test('1.2.3-beta.0 --preid beta --increment minor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'minor', 'beta', true),
          ).toBe('1.3.0-beta');
        });

        test('1.2.3-beta.0 --preid beta --increment major', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'major', 'beta', true),
          ).toBe('2.0.0-beta');
        });

        test('1.2.3-beta.0 --preid beta --increment prerelease', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'prerelease', 'beta', true),
          ).toBe('1.2.3-beta.1');
        });

        test('1.2.3-beta.0 --preid beta --increment prepatch', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'prepatch', 'beta', true),
          ).toBe('1.2.4-beta.0');
        });

        test('1.2.3-beta.0 --preid beta --increment preminor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'preminor', 'beta', true),
          ).toBe('1.3.0-beta.0');
        });

        test('1.2.3-beta.0 --preid beta --increment premajor', () => {
          // Act & Assert
          expect(
            incrementPackageVersion('1.2.3-beta.0', 'premajor', 'beta', true),
          ).toBe('2.0.0-beta.0');
        });
      });
    });
  });
});

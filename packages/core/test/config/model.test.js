import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { VersionOptions } from '../../src/config/model';

describe('@npmversion/core - config/model', () => {
  describe('VersionOptions', () => {
    test('should provide default values on instantiation whenno config provided', () => {
      // Act & Assert
      expect(new VersionOptions()).toMatchPlainObject({
        help: false,
        unpreid: false,
        'force-preid': false,
        'read-only': false,
        'nogit-commit': false,
        'nogit-tag': false,
        'git-push': false,
        'git-create-branch': false,
        increment: 'patch',
        preid: false,
        'git-remote-name': null,
        'git-branch-message': 'release/%s',
        'git-commit-message': 'Release version: %s',
        'git-tag-message': 'v%s',
      });
    });

    test('should provide default values on instantiation when empty object', () => {
      // Act & Assert
      expect(new VersionOptions({})).toMatchPlainObject({
        help: false,
        unpreid: false,
        'force-preid': false,
        'read-only': false,
        'nogit-commit': false,
        'nogit-tag': false,
        'git-push': false,
        'git-create-branch': false,
        increment: 'patch',
        preid: false,
        'git-remote-name': null,
        'git-branch-message': 'release/%s',
        'git-commit-message': 'Release version: %s',
        'git-tag-message': 'v%s',
      });
    });

    test('"default()" should provide default values', () => {
      // Act & Assert
      expect(VersionOptions.default()).toMatchPlainObject({
        help: false,
        unpreid: false,
        'force-preid': false,
        'read-only': false,
        'nogit-commit': false,
        'nogit-tag': false,
        'git-push': false,
        'git-create-branch': false,
        increment: 'patch',
        preid: false,
        'git-remote-name': null,
        'git-branch-message': 'release/%s',
        'git-commit-message': 'Release version: %s',
        'git-tag-message': 'v%s',
      });
    });
  });
});

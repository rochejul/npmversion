import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';
import { configRetriever } from '../../src/config/rc';

describe('@npmversion/core - config/rc', () => {
  describe('configRetriever', () => {
    test('should provide default valuesif not file is found', () => {
      // Act & Assert
      expect(new configRetriever()).toMatchPlainObject({
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

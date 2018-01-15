/**
 * RC parameters loader tests
 *
 * @module test/rc-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

describe(`RC retriever  - `, function () {
    const expect = require('chai').expect;
    const rcOptionsRetriever =  require('../lib/rc');

    it('should exports a function', function () {
        expect(typeof rcOptionsRetriever).equals('function');
    });

    it('should load the rc file from the root of the npmversion module', function () {
        expect(rcOptionsRetriever()).deep.equals({
            'force-preid': false,
            'nogit-commit': false,
            'nogit-tag': true,
            'git-remote-name': null,
            'git-branch-message': 'release/%s',
            'git-commit-message': 'Release version: %s',
            'git-push': false,
            'git-create-branch': false,
            'git-tag-message': 'v%s',
            'increment': 'minor',
            'ignoreErrorJsonFile': false,
            'jsonFiles': []
        });
    });
});

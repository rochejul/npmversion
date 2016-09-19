/**
 * RC parameters loader tests
 *
 * @module test/rc-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

const importLib = require('./importLib');

describe(`RC retriever${importLib.getContext()} - `, function () {
    const expect = require('chai').expect;
    const rcOptionsRetriever = importLib('rc');

    it('should exports a function', function () {
        expect(typeof rcOptionsRetriever).equals('function');
    });

    it('should load the rc file from the root of the npmversion module', function () {
        expect(rcOptionsRetriever()).deep.equals({
            'force-preid': false,
            'nogit-commit': false,
            'nogit-tag': true,
            'git-commit-message': 'Release version: %s',
            'git-push': false,
            'git-tag-message': 'v%s',
            'increment': 'minor'
        });
    });
});

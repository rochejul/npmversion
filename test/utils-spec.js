/**
 * Utils tests
 *
 * @module test/utils-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

describe('Utils - ', function () {
    const expect = require('chai').expect;
    const Utils = require('../lib/utils');

    it('should exports something', function () {
        expect(Utils).to.exist;
    });

    describe('and the method "paramsLoader" ', function () {
        it('should exist', function () {
            expect(Utils.paramsLoader).to.exist;
        });

        it('should load the rc file from the root of the npmversion module', function () {
            expect(Utils.paramsLoader([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-commit-message': 'Release version: %s',
                'git-push': false,
                'git-tag-message': 'v%s',
                'help': false,
                'i': 'minor',
                'increment': 'minor',
                'nogit-commit': false,
                'nogit-tag': true,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should load the rc file and set some options if some parameters are set with the cli parameters', function () {
            expect(Utils.paramsLoader(['--force-preid'])).deep.equals({
                '_': [],
                'force-preid': true,
                'git-commit-message': 'Release version: %s',
                'git-push': false,
                'git-tag-message': 'v%s',
                'help': false,
                'i': 'minor',
                'increment': 'minor',
                'nogit-commit': false,
                'nogit-tag': true,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should load the rc file and override some options if some parameters are set with the cli parameters', function () {
            expect(Utils.paramsLoader(['--force-preid', '--increment', 'minor', '--nogit-commit'])).deep.equals({
                '_': [],
                'force-preid': true,
                'git-commit-message': 'Release version: %s',
                'git-push': false,
                'git-tag-message': 'v%s',
                'help': false,
                'i': 'minor',
                'increment': 'minor',
                'nogit-commit': true,
                'nogit-tag': true,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });
});

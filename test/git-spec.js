/**
 * Git utils tests
 *
 * @module test/git-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

describe('GitUtils - ', function () {
    const expect = require('chai').expect;
    const GitUtils = require('../lib/git');

    it('should exports something', function () {
        expect(GitUtils).to.exist;
    });

    describe('and the method "createCommitLabel" ', function () {
        it('should exist', function () {
            expect(GitUtils.createCommitLabel).to.exist;
        });

        it('should return a default value if no label set', function () {
            expect(GitUtils.createCommitLabel('1.2.3')).equals('Release version: 1.2.3');
        });

        it('should inject the package version if a label is set', function () {
            expect(GitUtils.createCommitLabel('1.2.3', 'Release: %s')).equals('Release: 1.2.3');
        });

        it('should escape the double quote if a label is set', function () {
            expect(GitUtils.createCommitLabel('1.2.3', 'Release: "%s"')).equals('Release: \\"1.2.3\\"');
        });
    });

    describe('and the method "createTagLabel" ', function () {
        it('should exist', function () {
            expect(GitUtils.createTagLabel).to.exist;
        });

        it('should return a default value if no label set', function () {
            expect(GitUtils.createTagLabel('1.2.3')).equals('v1.2.3');
        });

        it('should inject the package version if a label is set', function () {
            expect(GitUtils.createTagLabel('1.2.3', '%s')).equals('1.2.3');
        });

        it('should escape the double quote if a label is set', function () {
            expect(GitUtils.createTagLabel('1.2.3', 'Version "%s"')).equals('Version \\"1.2.3\\"');
        });
    });
});

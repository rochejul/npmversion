/**
 * Cli parameters analyzer tests
 *
 * @module test/cli-params-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

const importLib = require('./importLib');

describe(`Cli-Params analyzer${importLib.getContext()} - `, function () {
    const expect = require('chai').expect;
    const versionOptionsAnalyzer = importLib('cli-params');

    it('should exports a function', function () {
        expect(typeof versionOptionsAnalyzer).equals('function');
    });

    describe('and the "help" option ', function () {
        it('should return false as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true if activated', function () {
            expect(versionOptionsAnalyzer(['--help'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': true,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });

    describe('and the "read-only" option ', function () {
        it('should return false as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true if activated', function () {
            expect(versionOptionsAnalyzer(['--read-only'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': true,
                'u': false,
                'unpreid': false
            });
        });
    });

    describe('and the "force-preid" option ', function () {
        it('should return false as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true if activated', function () {
            expect(versionOptionsAnalyzer(['--force-preid'])).deep.equals({
                '_': [],
                'force-preid': true,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });

    describe('and the "nogit-commit" option ', function () {
        it('should return false as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true if activated', function () {
            expect(versionOptionsAnalyzer(['--nogit-commit'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': true,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });

    describe('and the "nogit-tag" option ', function () {
        it('should return false as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true if activated', function () {
            expect(versionOptionsAnalyzer(['--nogit-tag'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': true,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });

    describe('and the "git-push" option ', function () {
        it('should return false as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true if activated', function () {
            expect(versionOptionsAnalyzer(['--git-push'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': true,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });

    describe('and the "preid" option ', function () {
        it('should return null as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true specified prefix if activated', function () {
            expect(versionOptionsAnalyzer(['--preid', 'beta'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': 'beta',
                'preid': 'beta',
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true specified prefix if activated with the alias', function () {
            expect(versionOptionsAnalyzer(['--preid', 'beta'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': 'beta',
                'preid': 'beta',
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });

    describe('and the "unpreid" option ', function () {
        it('should return false as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return true if activated', function () {
            expect(versionOptionsAnalyzer(['--unpreid'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': true,
                'unpreid': true
            });
        });

        it('should return true if activated with the alias', function () {
            expect(versionOptionsAnalyzer(['-u'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': true,
                'unpreid': true
            });
        });
    });

    describe('and the "increment" option ', function () {
        it('should return "patch" as default value', function () {
            expect(versionOptionsAnalyzer([])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'patch',
                'increment': 'patch',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return the specified version if activated', function () {
            expect(versionOptionsAnalyzer(['--increment', 'minor'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'minor',
                'increment': 'minor',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });

        it('should return the specified version if activated with the alias', function () {
            expect(versionOptionsAnalyzer(['-i', 'minor'])).deep.equals({
                '_': [],
                'force-preid': false,
                'git-push': false,
                'help': false,
                'i': 'minor',
                'increment': 'minor',
                'nogit-commit': false,
                'nogit-tag': false,
                'p': null,
                'preid': null,
                'read-only': false,
                'u': false,
                'unpreid': false
            });
        });
    });
});

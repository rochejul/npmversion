/**
 * Utils tests
 *
 * @module test/utils-spec
 * @author Julien Roche
 * @version 1.3.0
 * @since 0.0.1
 */

'use strict';

const importLib = require('./importLib');

describe(`Utils${importLib.getContext()} - `, function () {
    const expect = require('chai').expect;
    const sinon = require('sinon');
    const Utils = importLib('utils');

    const fs = require('fs');
    const path = require('path');

    let sinonSandBox;

    it('should exports something', function () {
        expect(Utils).to.exist;
    });

    beforeEach(function () {
        sinonSandBox = sinon.sandbox.create();
    });

    afterEach(function () {
        sinonSandBox && sinonSandBox.restore();
        sinonSandBox = null;
    });

    describe('and the method "isJsonFileEntry" ', function () {
        it('should exist', function () {
            expect(Utils.isJsonFileEntry).to.exist;
        });

        it('should return true if the object is a JsonFileEntry', function () {
            expect(Utils.isJsonFileEntry({ 'file': 'bower.json', 'property': 'version' })).to.be.true;
        });

        it('should return false otherwise', function () {
            expect(Utils.isJsonFileEntry({ 'file': 'bower.json' })).to.be.false;
            expect(Utils.isJsonFileEntry({ 'property': 'version' })).to.be.false;
            expect(Utils.isJsonFileEntry({ })).to.be.false;
            expect(Utils.isJsonFileEntry()).to.be.false;
        });
    });

    describe('and the method "replaceJsonProperty" ', function () {
        it('should exist', function () {
            expect(Utils.replaceJsonProperty).to.exist;
        });

        it('should return the property value', function () {
            expect(Utils.replaceJsonProperty('{"version":"1.2.3"}', 'version', '3.2.1')).to.equals('{"version":"3.2.1"}');
            expect(Utils.replaceJsonProperty('{"version": "1.2.3"}', 'version', '3.2.1')).to.equals('{"version": "3.2.1"}');
            expect(Utils.replaceJsonProperty('{"version" :"1.2.3"}', 'version', '3.2.1')).to.equals('{"version" :"3.2.1"}');
            expect(Utils.replaceJsonProperty('{"version" : "1.2.3"}', 'version', '3.2.1')).to.equals('{"version" : "3.2.1"}');
            expect(Utils.replaceJsonProperty('{"version":"1.2.3","description": "aa"}', 'version', '3.2.1')).to.equals('{"version":"3.2.1","description": "aa"}');
            expect(Utils.replaceJsonProperty('{"version": "1.2.3","description": "aa"}', 'version', '3.2.1')).to.equals('{"version": "3.2.1","description": "aa"}');
            expect(Utils.replaceJsonProperty('{"version" :"1.2.3","description": "aa"}', 'version', '3.2.1')).to.equals('{"version" :"3.2.1","description": "aa"}');
            expect(Utils.replaceJsonProperty('{"version" : "1.2.3","description": "aa"}', 'version', '3.2.1')).to.equals('{"version" : "3.2.1","description": "aa"}');
        });

        it('should do nothing', function () {
            expect(Utils.replaceJsonProperty('{"version":"1.2.3"}', 'description', '3.2.1')).to.equals('{"version":"1.2.3"}');
        });
    });

    describe('and the method "replaceJsonVersionProperty" ', function () {
        it('should exist', function () {
            expect(Utils.replaceJsonVersionProperty).to.exist;
        });

        it('should call the replaceJsonProperty function', function () {
            let replaceJsonPropertySpy = sinonSandBox.spy(Utils, 'replaceJsonProperty');
            expect(Utils.replaceJsonVersionProperty('{"version":"1.2.3"}', '3.2.1')).to.equals('{"version":"3.2.1"}');
            expect(replaceJsonPropertySpy.called).to.be.true;
            expect(replaceJsonPropertySpy.args).deep.equals([
                ['{"version":"1.2.3"}', 'version', '3.2.1']
            ]);
        });
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
                'unpreid': false,
                'jsonFiles': []
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
                'unpreid': false,
                'jsonFiles': []
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
                'unpreid': false,
                'jsonFiles': []
            });
        });
    });

    describe('and the method "readFile" ', function () {
        it('should exist', function () {
            expect(Utils.readFile).to.exist;
        });

        it('should reject the promise if we cannot read the file', function () {
            sinonSandBox.stub(fs, 'readFile', (path, callback) => callback(new Error('an error')));

            return Utils
                .readFile('./bower.json')
                .then(function () {
                    expect(true).to.be.false;
                })
                .catch(function (err) {
                    expect(err).to.exist;
                    expect(err instanceof Error);
                    expect(err.message).to.equals('an error');
                });
        });

        it('should return the content of the file', function () {
            return Utils
                .readFile(path.resolve(path.join(__dirname, './file.txt')))
                .then(function (content) {
                    expect(content.startsWith('Some content')).to.be.true;
                })
        });
    });
});

/**
 * Utils tests
 *
 * @module test/utils-spec
 * @author Julien Roche
 * @version 1.3.0
 * @since 0.0.1
 */

'use strict';

describe('Utils  - ', function () {
    const expect = require('chai').expect;
    const sinon = require('sinon');
    const Utils =  require('../lib/utils');

    const fs = require('fs');
    const path = require('path');
    const childProcess = require('child_process');

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

    describe('and the method "promisedExec" ', function () {
        it('should exist', function () {
            expect(Utils.promisedExec).to.exist;
        });

        it('should resolve the promise when the execution is done', function () {
            sinonSandBox.stub(childProcess, 'exec', (command, options, callback) => callback(null));
            return Utils.promisedExec('ls -la', true);
        });

        it('should return the command output', function () {
            sinonSandBox.stub(childProcess, 'exec', (command, options, callback) => callback(null, 'return of the command'));
            return Utils.promisedExec('ls -la', true)
                .then(commandOutput => {
                    expect(commandOutput).equals('return of the command');
                });
        });

        it('should reject the promise when the execution is rejected', function () {
            sinonSandBox.stub(childProcess, 'exec', (command, options, callback) => callback(500));
            return Utils
                .promisedExec('ls -la', true)
                .then(() => Promise.reject('Should not be called'))
                .catch(() => Promise.resolve());
        });

        it('should use per default the process.cwd', function () {
            let execStub = sinonSandBox.stub(childProcess, 'exec', (command, options, callback) => callback(null));
            return Utils
                .promisedExec('ls -la', true)
                .then(() => {
                    expect(execStub.calledWithExactly('ls -la', { 'cwd': process.cwd(), 'maxBuffer': 20000000 }, sinon.match.func)).to.be.true;
                });
        });

        it('should use  the specified cwd', function () {
            let execStub = sinonSandBox.stub(childProcess, 'exec', (command, options, callback) => callback(null));
            return Utils
                .promisedExec('ls -la', true, '/etc')
                .then(() => {
                    expect(execStub.calledWithExactly('ls -la', { 'cwd': '/etc', 'maxBuffer': 20000000 }, sinon.match.func)).to.be.true;
                });
        });

        it('should log the ouput', function () {
            let instance = {
                'stderr': { 'on': function () { } },
                'stdout': { 'on': function () { } }
            };

            let stderrOnStub = sinonSandBox.spy(instance.stderr, 'on');
            sinonSandBox.spy(instance.stdout, 'on');
            sinonSandBox.stub(childProcess, 'exec', (command, options, callback) => {
                callback(null);
                return instance;
            });
            return Utils
                .promisedExec('ls -la', false)
                .then(() => {
                    expect(instance.stderr.on.called);
                    expect(stderrOnStub.withArgs('data', sinon.match.func).calledOnce).to.be.true;
                    expect(instance.stdout.on.called);
                    expect(instance.stdout.on.withArgs('data', sinon.match.func).calledOnce).to.be.true;
                });
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
                'git-remote-name': null,
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
                'ignoreErrorJsonFile': false,
                'jsonFiles': []
            });
        });

        it('should load the rc file and set some options if some parameters are set with the cli parameters', function () {
            expect(Utils.paramsLoader(['--force-preid'])).deep.equals({
                '_': [],
                'force-preid': true,
                'git-remote-name': null,
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
                'ignoreErrorJsonFile': false,
                'jsonFiles': []
            });
        });

        it('should load the rc file and override some options if some parameters are set with the cli parameters', function () {
            expect(Utils.paramsLoader(['--force-preid', '--increment', 'minor', '--nogit-commit', '--git-remote-name', 'origin'])).deep.equals({
                '_': [],
                'force-preid': true,
                'git-remote-name': 'origin',
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
                'ignoreErrorJsonFile': false,
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

    describe('and the method "splitByEndOfLine" ', function () {
        it('should exist', function () {
            expect(Utils.splitByEndOfLine).to.exist;
        });

        it('should return an empty array if no string is specified', function () {
            expect(Utils.splitByEndOfLine()).deep.equals([]);
            expect(Utils.splitByEndOfLine(null)).deep.equals([]);
        });

        it('should return an empty array if string is empty', function () {
            expect(Utils.splitByEndOfLine('')).deep.equals([]);
        });

        it('should return an array with only one item if end of line was detected', function () {
            expect(Utils.splitByEndOfLine('one')).deep.equals(['one']);
        });

        it('should return an array based on \\n', function () {
            expect(Utils.splitByEndOfLine('one\ntwo')).deep.equals(['one', 'two']);
        });

        it('should return an array based on \\r\\n', function () {
            expect(Utils.splitByEndOfLine('one\r\ntwo')).deep.equals(['one', 'two']);
        });

        it('should not return empty lines', function () {
            expect(Utils.splitByEndOfLine('one\n\ntwo\n')).deep.equals(['one', 'two']);
        });
    });
});

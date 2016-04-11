/**
 * Version utils tests
 *
 * @module test/version-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

describe('VersionUtils - ', function () {
    const chai = require('chai');
    const expect = chai.expect;
    const sinon = require('sinon');

    const VersionUtils = require('../lib/version');
    const Utils = require('../lib/utils');
    const noop = function () { };
    let sinonSandBox = null;

    it('should exports something', function () {
        expect(VersionUtils).to.exist;
    });

    beforeEach(function () {
        sinonSandBox = sinon.sandbox.create();
    });

    afterEach(function () {
        if (sinonSandBox) {
            sinonSandBox.restore();
            sinonSandBox = null;
        }
    });

    describe('and the method "doIt" ', function () {
        it('should exist', function () {
            expect(VersionUtils.doIt).to.exist;
        });

        describe('should print the help', function () {
            it('no options are passed ', function () {
                let printHelpStub = sinonSandBox.stub(VersionUtils, 'printHelp', noop);

                VersionUtils.doIt();

                expect(printHelpStub.called).to.be.true;
                expect(printHelpStub.calledOnce).to.be.true;
            });

            it('if the help option is passed ', function () {
                let printHelpStub = sinonSandBox.stub(VersionUtils, 'printHelp', noop);

                VersionUtils.doIt({ 'help': true });

                expect(printHelpStub.called).to.be.true;
                expect(printHelpStub.calledOnce).to.be.true;
            });
        });

        it('should print an error message if no package.json file was detected', function () {
            sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => false);
            let printNotFoundStub = sinonSandBox.stub(VersionUtils, 'printNotFoundPackageJsonFile', noop);

            VersionUtils.doIt({ 'increment': 'patch' });

            expect(printNotFoundStub.called).to.be.true;
            expect(printNotFoundStub.calledOnce).to.be.true;
        });

        it('should print the bump result if read only is set', function () {
            sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
            sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                return { 'version': '0.0.1' };
            });

            let printVersionStub = sinonSandBox.stub(VersionUtils, 'printVersion', noop);

            VersionUtils.doIt({ 'increment': 'patch', 'read-only': true });

            expect(printVersionStub.called).to.be.true;
            expect(printVersionStub.calledOnce).to.be.true;
            expect(printVersionStub.calledWithExactly('0.0.2')).to.be.true;
        });

        describe('should increment the version ', function () {
            it('if the option is set', function () {
                sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
                sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                    return { 'version': '0.0.1' };
                });

                let printVersionStub = sinonSandBox.stub(VersionUtils, 'printVersion', noop);

                VersionUtils.doIt({ 'increment': 'patch', 'read-only': true });

                expect(printVersionStub.called).to.be.true;
                expect(printVersionStub.calledOnce).to.be.true;
                expect(printVersionStub.calledWithExactly('0.0.2')).to.be.true;
            });

            it('to "patch" if the level is not recognized', function () {
                sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
                sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                    return { 'version': '0.0.1' };
                });

                let printVersionStub = sinonSandBox.stub(VersionUtils, 'printVersion', noop);

                VersionUtils.doIt({ 'increment': 'fake', 'read-only': true });

                expect(printVersionStub.called).to.be.true;
                expect(printVersionStub.calledOnce).to.be.true;
                expect(printVersionStub.calledWithExactly('0.0.2')).to.be.true;
            });

            it('with all possible options', function () {
                sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
                sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                    return { 'version': '0.0.1' };
                });

                let incrementPackageVersionSpy = sinonSandBox.spy(VersionUtils, 'incrementPackageVersion');
                let printVersionStub = sinonSandBox.stub(VersionUtils, 'printVersion', noop);

                VersionUtils.doIt({ 'increment': 'PATCH', 'read-only': true, 'preid': 'beta', 'force-preid': true });

                expect(incrementPackageVersionSpy.called).to.be.true;
                expect(incrementPackageVersionSpy.calledOnce).to.be.true;
                expect(incrementPackageVersionSpy.calledWithExactly('0.0.1', 'patch', 'beta', true)).to.be.true;

                expect(printVersionStub.called).to.be.true;
                expect(printVersionStub.calledOnce).to.be.true;
                expect(printVersionStub.calledWithExactly('0.0.2-beta')).to.be.true;
            });
        });

        it('should unpreid the version if the option is specified', function () {
            sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
            sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                return { 'version': '0.0.1-snapshot' };
            });

            let printVersionStub = sinonSandBox.stub(VersionUtils, 'printVersion', noop);

            VersionUtils.doIt({ 'unpreid': true, 'read-only': true });

            expect(printVersionStub.called).to.be.true;
            expect(printVersionStub.calledOnce).to.be.true;
            expect(printVersionStub.calledWithExactly('0.0.1')).to.be.true;
        });

        describe('should use git, ', function () {
            it('and log an error if needed', function () {
                sinonSandBox.stub(VersionUtils, 'updatePackageVersion', () => Promise.reject('an error'));
                let printErrorSpy = sinonSandBox.stub(VersionUtils, 'printError', noop);

                return VersionUtils
                    .doIt({ 'increment': 'fake' })
                    .then(function () {
                        chai.fail('The then method should not be called');
                    })
                    .catch(function(err) {
                        expect(printErrorSpy.called).to.be.true;
                        expect(printErrorSpy.calledOnce).to.be.true;
                        expect(printErrorSpy.calledWithExactly('an error')).to.be.true;
                    });
            });

            describe('expecially ', function () {
                let calls;

                beforeEach(function () {
                    calls = [];
                    sinonSandBox.stub(VersionUtils, 'updatePackageVersion', function () {
                        calls.push(['updatePackageVersion'].concat([].splice.apply(arguments, arguments)));
                        return Promise.resolve();
                    });

                    sinonSandBox.stub(Utils, 'promisedExec', function () {
                        calls.push(['promisedExec'].concat([].splice.apply(arguments, arguments)));
                        return Promise.resolve();
                    });
                });

                afterEach(function () {
                    calls = null;
                });

                it('create by default a commit and a tag', function () {
                    sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                        return { 'version': '1.2.0' };
                    });

                    return VersionUtils
                        .doIt({ 'increment': 'fake' })
                        .then(function () {
                            expect(calls).deep.equals([
                                [
                                    "updatePackageVersion",
                                    "1.2.1"
                                ],
                                [
                                    "promisedExec",
                                    "git commit --all --message \"Release version: 1.2.1\""
                                ],
                                [
                                    "promisedExec",
                                    "git tag \"v1.2.1\""
                                ]
                            ]);
                        });
                });

                it('push the commit and the tag', function () {
                    sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                        return { 'version': '1.2.0' };
                    });

                    return VersionUtils
                        .doIt({ 'increment': 'fake', 'git-push': true })
                        .then(function () {
                            expect(calls).deep.equals([
                                [
                                    "updatePackageVersion",
                                    "1.2.1"
                                ],
                                [
                                    "promisedExec",
                                    "git commit --all --message \"Release version: 1.2.1\""
                                ],
                                [
                                    "promisedExec",
                                    "git tag \"v1.2.1\""
                                ],
                                [
                                    "promisedExec",
                                    "git push && git push --tags"
                                ]
                            ]);
                        });
                });

                it('push only the commit if no tag is generated', function () {
                    sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                        return { 'version': '1.2.0' };
                    });

                    return VersionUtils
                        .doIt({ 'increment': 'fake', 'git-push': true, 'no-git-tag': true })
                        .then(function () {
                            expect(calls).deep.equals([
                                [
                                    "updatePackageVersion",
                                    "1.2.1"
                                ],
                                [
                                    "promisedExec",
                                    "git commit --all --message \"Release version: 1.2.1\""
                                ],
                                [
                                    "promisedExec",
                                    "git push"
                                ]
                            ]);
                        });
                });

                it('create no commit if specified', function () {
                    sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                        return { 'version': '1.2.0' };
                    });

                    return VersionUtils
                        .doIt({ 'increment': 'fake', 'no-git-commit': true, 'no-git-tag': true })
                        .then(function () {
                            expect(calls).deep.equals([
                                [
                                    "updatePackageVersion",
                                    "1.2.1"
                                ]
                            ]);
                        });
                });

                it('wrap with a pre and post npm-scripts command', function () {
                    sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
                        return {
                            'version': '1.2.0',
                            'scripts': {
                                'prenpmversion': 'echo "Hello"',
                                'postnpmversion': 'echo "Wordl"'
                            }
                        };
                    });

                    return VersionUtils
                        .doIt({ 'increment': 'fake', 'git-push': true })
                        .then(function () {
                            expect(calls).deep.equals([
                                [
                                    "promisedExec",
                                    "npm run prenpmversion"
                                ],
                                [
                                    "updatePackageVersion",
                                    "1.2.1"
                                ],
                                [
                                    "promisedExec",
                                    "npm run postnpmversion"
                                ],
                                [
                                    "promisedExec",
                                    "git commit --all --message \"Release version: 1.2.1\""
                                ],
                                [
                                    "promisedExec",
                                    "git tag \"v1.2.1\""
                                ],
                                [
                                    "promisedExec",
                                    "git push && git push --tags"
                                ]
                            ]);
                        });
                });
            });
        });
    });

    describe('and the method "unpreidPackageVersion" ', function () {
        it('should exist', function () {
            expect(VersionUtils.unpreidPackageVersion).to.exist;
        });

        it('should do nothing if no preid is detected', function () {
            expect(VersionUtils.unpreidPackageVersion('1.2.3')).equal('1.2.3');
        });

        describe('should do something ', function () {
            it('if prerelease / prepatch is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.2.4-0')).equal('1.2.4');
            });

            it('if preminor is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.3.0-0')).equal('1.3.0');
            });

            it('if premajor is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('2.0.0-0')).equal('2.0.0');
            });

            it('if prerelease / prepatch with flag is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.2.4-beta.0')).equal('1.2.4');
            });

            it('if preminor with flag is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.3.0-beta.0')).equal('1.3.0');
            });

            it('if premajor with flag is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('2.0.0-beta.0')).equal('2.0.0');
            });
        });
    });

    describe('and the method "incrementPackageVersion" ', function () {
        it('should exist', function () {
            expect(VersionUtils.incrementPackageVersion).to.exist;
        });

        describe('should classicaly increment with the following options: ', function () {
            describe('Basics - ', function () {
                it('1.2.3 --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'patch')).equals('1.2.4');
                });

                it('1.2.3 --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'minor')).equals('1.3.0');
                });

                it('1.2.3 --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'major')).equals('2.0.0');
                });

                it('1.2.3 --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prerelease')).equals('1.2.4-0');
                });

                it('1.2.3 --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3 --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3 --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'premajor')).equals('2.0.0-0');
                });
            });

            describe('With prenumber - ', function () {
                it('1.2.3-0 --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'patch')).equals('1.2.3');
                });

                it('1.2.3-0 --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'minor')).equals('1.3.0');
                });

                it('1.2.3-0 --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'major')).equals('2.0.0');
                });

                it('1.2.3-0 --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prerelease')).equals('1.2.3-1');
                });

                it('1.2.3-0 --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3-0 --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3-0 --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor')).equals('2.0.0-0');
                });
            });

            describe('With preid - ', function () {
                it('1.2.3-beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch')).equals('1.2.3');
                });

                it('1.2.3-beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor')).equals('1.3.0');
                });

                it('1.2.3-beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'major')).equals('2.0.0');
                });

                it('1.2.3-beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prerelease')).equals('1.2.3-beta.0');
                });

                it('1.2.3-beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3-beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3-beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'premajor')).equals('2.0.0-0');
                });
            });

            describe('With prenumber and preid - ', function () {
                it('1.2.3-beta.0 --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'patch')).equals('1.2.3');
                });

                it('1.2.3-beta.0 --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'minor')).equals('1.3.0');
                });

                it('1.2.3-beta.0 --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'major')).equals('2.0.0');
                });

                it('1.2.3-beta.0 --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prerelease')).equals('1.2.3-beta.1');
                });

                it('1.2.3-beta.0 --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3-beta.0 --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3-beta.0 --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'premajor')).equals('2.0.0-0');
                });
            });
        });

        describe('should classicaly increment with the following options (where a preid flag to "beta" is set): ', function () {
            describe('Basics - ', function () {
                it('1.2.3 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'patch', 'beta')).equals('1.2.4');
                });

                it('1.2.3 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prerelease', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber - ', function () {
                it('1.2.3-0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'patch', 'beta')).equals('1.2.3');
                });

                it('1.2.3-0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3-0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3-0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prerelease', 'beta')).equals('1.2.3-beta.0');
                });

                it('1.2.3-0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3-0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3-0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });

            describe('With preid - ', function () {
                it('1.2.3-beta --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch', 'beta')).equals('1.2.3');
                });

                it('1.2.3-beta --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3-beta --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3-beta --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prerelease', 'beta')).equals('1.2.3-beta.0');
                });

                it('1.2.3-beta --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber and preid - ', function () {
                it('1.2.3-beta.0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'patch', 'beta')).equals('1.2.3');
                });

                it('1.2.3-beta.0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3-beta.0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3-beta.0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prerelease', 'beta')).equals('1.2.3-beta.1');
                });

                it('1.2.3-beta.0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });
        });

        describe('should increment with the following options (where a preid flag to "beta" is set) and where we force to add the preid if needed: ', function () {
            describe('Basics - ', function () {
                it('1.2.3 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'patch', 'beta', true)).equals('1.2.4-beta');
                });

                it('1.2.3 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prerelease', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber - ', function () {
                it('1.2.3-0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'patch', 'beta', true)).equals('1.2.3-beta');
                });

                it('1.2.3-0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3-0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3-0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prerelease', 'beta', true)).equals('1.2.3-beta.0');
                });

                it('1.2.3-0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3-0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3-0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });

            describe('With preid - ', function () {
                it('1.2.3-beta --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch', 'beta', true)).equals('1.2.4-beta');
                });

                it('1.2.3-beta --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3-beta --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3-beta --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prerelease', 'beta', true)).equals('1.2.3-beta.0');
                });

                it('1.2.3-beta --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber and preid - ', function () {
                it('1.2.3-beta.0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'patch', 'beta', true)).equals('1.2.4-beta');
                });

                it('1.2.3-beta.0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3-beta.0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3-beta.0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prerelease', 'beta', true)).equals('1.2.3-beta.1');
                });

                it('1.2.3-beta.0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });
        });
    });

    describe('and the method "isPostnpmversionRunScriptDetectedInPackageJson" ', function () {
        it('should exist', function () {
            expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson).to.exist;
        });

        it('should return false if no content into the package.json', function () {
            expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson()).to.be.false;
            expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson(null)).to.be.false;
        });

        it('should return false there is no "scripts" property', function () {
            expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({ })).to.be.false;
        });

        it('should return false there is no "postnpmversion" property into the scripts part', function () {
            expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({ 'scripts': { } })).to.be.false;
        });

        it('should return false if "postnpmversion" is empty', function () {
            expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({ 'scripts': { 'postnpmversion': '' } })).to.be.false;
        });

        it('should return true otherwise', function () {
            expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({ 'scripts': { 'postnpmversion': 'echo "test"' } })).to.be.true;
        });
    });

    describe('and the method "isPrenpmversionRunScriptDetectedInPackageJson" ', function () {
        it('should exist', function () {
            expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson).to.exist;
        });

        it('should return false if no content into the package.json', function () {
            expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson()).to.be.false;
            expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson(null)).to.be.false;
        });

        it('should return false there is no "scripts" property', function () {
            expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({ })).to.be.false;
        });

        it('should return false there is no "prenpmversion" property into the scripts part', function () {
            expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({ 'scripts': { } })).to.be.false;
        });

        it('should return false if "prenpmversion" is empty', function () {
            expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({ 'scripts': { 'prenpmversion': '' } })).to.be.false;
        });

        it('should return true otherwise', function () {
            expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({ 'scripts': { 'prenpmversion': 'echo "test"' } })).to.be.true;
        });
    });
});

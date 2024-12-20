/**
 * Version utils tests
 *
 * @module test/version-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

describe(`VersionUtils  - `, function () {
  const chai = require('chai');
  const expect = chai.expect;
  const sinon = require('sinon');

  const fs = require('fs');
  const path = require('path');

  const VersionUtils = require('../lib/version');
  const GitUtils = require('../lib/git');
  const Utils = require('../lib/utils');
  const Messages = require('../lib/messages');
  const noop = function () {};
  let sinonSandBox = null;

  it('should exports something', function () {
    expect(VersionUtils).to.exist;
  });

  beforeEach(function () {
    sinonSandBox = sinon.sandbox.create();

    sinonSandBox.stub(GitUtils, 'getBranchName', () =>
      Promise.resolve('release/fakeBranch'),
    );
    sinonSandBox.stub(GitUtils, 'getRemoteName', () =>
      Promise.resolve('origin'),
    );
  });

  afterEach(function () {
    if (sinonSandBox) {
      sinonSandBox.restore();
      sinonSandBox = null;
    }
  });

  describe('and the method "hasFoundPackageJsonFile" ', function () {
    it('should exist', function () {
      expect(VersionUtils.hasFoundPackageJsonFile).to.exist;
    });

    it('should return true if we can found the package.json file', function () {
      sinonSandBox.stub(fs, 'existsSync', () => true);
      expect(VersionUtils.hasFoundPackageJsonFile()).to.be.true;
    });

    it('should return false if we cannot found the package.json file', function () {
      sinonSandBox.stub(fs, 'existsSync', () => false);
      expect(VersionUtils.hasFoundPackageJsonFile()).to.be.false;
    });

    describe('should find the package.json based ', function () {
      it('on the current CWD', function () {
        sinonSandBox.stub(fs, 'existsSync', () => '{ "version": "1.2.3" }');
        VersionUtils.hasFoundPackageJsonFile();

        expect(
          fs.existsSync.calledWithExactly(
            path.resolve(process.cwd() + '/package.json'),
          ),
        ).to.be.true;
      });

      it('on the specified CWD', function () {
        sinonSandBox.stub(fs, 'existsSync', () => '{ "version": "1.2.3" }');
        VersionUtils.hasFoundPackageJsonFile('/etc');

        expect(
          fs.existsSync.calledWithExactly(
            path.resolve(path.join('/etc', 'package.json')),
          ),
        ).to.be.true;
      });
    });
  });

  describe('and the method "getCurrentPackageJson" ', function () {
    it('should exist', function () {
      expect(VersionUtils.getCurrentPackageJson).to.exist;
    });

    it('should return the content of the JSON file', function () {
      sinonSandBox.stub(fs, 'readFileSync', () => '{ "version": "1.2.3" }');
      let json = VersionUtils.getCurrentPackageJson();

      expect(json).deep.equals({ version: '1.2.3' });
    });

    describe('should load the package.json content based ', function () {
      it('on the current CWD', function () {
        sinonSandBox.stub(fs, 'readFileSync', () => '{ "version": "1.2.3" }');
        VersionUtils.getCurrentPackageJson();

        expect(
          fs.readFileSync.calledWithExactly(
            path.resolve(process.cwd() + '/package.json'),
          ),
        ).to.be.true;
      });

      it('on the specified CWD', function () {
        sinonSandBox.stub(fs, 'readFileSync', () => '{ "version": "1.2.3" }');
        VersionUtils.getCurrentPackageJson('/etc');

        expect(
          fs.readFileSync.calledWithExactly(
            path.resolve(path.join('/etc', 'package.json')),
          ),
        ).to.be.true;
      });
    });
  });

  describe('and the method "getCurrentPackageJsonVersion" ', function () {
    it('should exist', function () {
      expect(VersionUtils.getCurrentPackageJsonVersion).to.exist;
    });

    it('should return the version of the JSON object', function () {
      let version = VersionUtils.getCurrentPackageJsonVersion({
        version: '1.2.3',
      });

      expect(version).equals('1.2.3');
    });

    it('should return the version of the JSON file', function () {
      sinonSandBox.stub(fs, 'readFileSync', () => '{ "version": "1.2.3" }');
      let version = VersionUtils.getCurrentPackageJsonVersion();

      expect(version).equals('1.2.3');
    });

    describe('should load the package.json content based ', function () {
      it('on the current CWD', function () {
        sinonSandBox.stub(fs, 'readFileSync', () => '{ "version": "1.2.3" }');
        VersionUtils.getCurrentPackageJsonVersion();

        expect(
          fs.readFileSync.calledWithExactly(
            path.resolve(process.cwd() + '/package.json'),
          ),
        ).to.be.true;
      });

      it('on the specified CWD', function () {
        sinonSandBox.stub(fs, 'readFileSync', () => '{ "version": "1.2.3" }');
        VersionUtils.getCurrentPackageJsonVersion(null, '/etc');

        expect(
          fs.readFileSync.calledWithExactly(
            path.resolve(path.join('/etc', 'package.json')),
          ),
        ).to.be.true;
      });
    });
  });

  describe('and the method "getIncrementationLevel" ', function () {
    it('should exist', function () {
      expect(VersionUtils.getIncrementationLevel).to.exist;
    });

    it('should return patch if no options are provided', function () {
      expect(VersionUtils.getIncrementationLevel()).equals('patch');
    });

    it('should return patch if no increment level is specified', function () {
      expect(VersionUtils.getIncrementationLevel({})).equals('patch');
    });

    it('should return patch if the increment level is not recognized', function () {
      expect(VersionUtils.getIncrementationLevel({ increment: 'fake' })).equals(
        'patch',
      );
    });

    describe('should the specified level ', function () {
      it('with cases checking', function () {
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'major' }),
        ).equals('major');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'minor' }),
        ).equals('minor');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'patch' }),
        ).equals('patch');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'premajor' }),
        ).equals('premajor');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'preminor' }),
        ).equals('preminor');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'prepatch' }),
        ).equals('prepatch');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'prerelease' }),
        ).equals('prerelease');
      });

      it('without cases checking', function () {
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'MAJOR' }),
        ).equals('major');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'MINOR' }),
        ).equals('minor');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'PATCH' }),
        ).equals('patch');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'PREMAJOR' }),
        ).equals('premajor');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'PREMINOR' }),
        ).equals('preminor');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'PREPATCH' }),
        ).equals('prepatch');
        expect(
          VersionUtils.getIncrementationLevel({ increment: 'PRERELEASE' }),
        ).equals('prerelease');
      });
    });
  });

  describe('and the method "checkForGitIfNeeded" ', function () {
    it('should exist', function () {
      expect(VersionUtils.checkForGitIfNeeded).to.exist;
    });

    it('should raise a specific error if no git is installed', function () {
      sinonSandBox.stub(GitUtils, 'hasGitInstalled', () =>
        Promise.resolve(false),
      );

      return VersionUtils.checkForGitIfNeeded({ 'git-push': true })
        .then(function () {
          expect(true).to.be.false;
        })
        .catch(function (err) {
          expect(err).to.exist;
          expect(err instanceof Error).to.be.true;
          expect(err.name).to.equals('GitNotInstalledError');
        });
    });

    it('should raise a specific error if we are not into a git project', function () {
      sinonSandBox.stub(GitUtils, 'hasGitInstalled', () =>
        Promise.resolve(true),
      );
      sinonSandBox.stub(GitUtils, 'hasGitProject', () =>
        Promise.resolve(false),
      );

      return VersionUtils.checkForGitIfNeeded({ 'git-push': true })
        .then(function () {
          expect(true).to.be.false;
        })
        .catch(function (err) {
          expect(err).to.exist;
          expect(err instanceof Error).to.be.true;
          expect(err.name).to.equals('NotAGitProjectError');
        });
    });

    it('should do nothing otherwise', function () {
      sinonSandBox.stub(GitUtils, 'hasGitInstalled', () =>
        Promise.resolve(true),
      );
      sinonSandBox.stub(GitUtils, 'hasGitProject', () => Promise.resolve(true));

      return VersionUtils.checkForGitIfNeeded({ 'git-push': true });
    });
  });

  describe('and the method "doIt" ', function () {
    it('should exist', function () {
      expect(VersionUtils.doIt).to.exist;
    });

    describe('should print the help', function () {
      it('no options are passed ', function () {
        let printHelpStub = sinonSandBox.stub(VersionUtils, 'printHelp', noop);

        VersionUtils.doIt().catch(() => {});

        expect(printHelpStub.called).to.be.true;
        expect(printHelpStub.calledOnce).to.be.true;
      });

      it('if the help option is passed ', function () {
        let printHelpStub = sinonSandBox.stub(VersionUtils, 'printHelp', noop);

        VersionUtils.doIt({ help: true }).catch(() => {});

        expect(printHelpStub.called).to.be.true;
        expect(printHelpStub.calledOnce).to.be.true;
      });
    });

    it('should print an error message if no package.json file was detected', function () {
      sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => false);
      let printNotFoundStub = sinonSandBox.stub(
        VersionUtils,
        'printNotFoundPackageJsonFile',
        noop,
      );

      VersionUtils.doIt({ increment: 'patch' }).catch(() => {});

      expect(printNotFoundStub.called).to.be.true;
      expect(printNotFoundStub.calledOnce).to.be.true;
    });

    it('should print the bump result if read only is set', function () {
      sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
      sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
        return { version: '0.0.1' };
      });

      let printVersionStub = sinonSandBox.stub(
        VersionUtils,
        'printVersion',
        noop,
      );

      VersionUtils.doIt({ increment: 'patch', 'read-only': true }).catch(
        () => {},
      );

      expect(printVersionStub.called).to.be.true;
      expect(printVersionStub.calledOnce).to.be.true;
      expect(printVersionStub.calledWithExactly('0.0.2')).to.be.true;
    });

    describe('should increment the version ', function () {
      it('if the option is set', function () {
        sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
        sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
          return { version: '0.0.1' };
        });

        let printVersionStub = sinonSandBox.stub(
          VersionUtils,
          'printVersion',
          noop,
        );

        VersionUtils.doIt({ increment: 'patch', 'read-only': true }).catch(
          () => {},
        );

        expect(printVersionStub.called).to.be.true;
        expect(printVersionStub.calledOnce).to.be.true;
        expect(printVersionStub.calledWithExactly('0.0.2')).to.be.true;
      });

      it('to "patch" if the level is not recognized', function () {
        sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
        sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
          return { version: '0.0.1' };
        });

        let printVersionStub = sinonSandBox.stub(
          VersionUtils,
          'printVersion',
          noop,
        );

        VersionUtils.doIt({ increment: 'fake', 'read-only': true }).catch(
          () => {},
        );

        expect(printVersionStub.called).to.be.true;
        expect(printVersionStub.calledOnce).to.be.true;
        expect(printVersionStub.calledWithExactly('0.0.2')).to.be.true;
      });

      it('with all possible options', function () {
        sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
        sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
          return { version: '0.0.1' };
        });

        let incrementPackageVersionSpy = sinonSandBox.spy(
          VersionUtils,
          'incrementPackageVersion',
        );
        let printVersionStub = sinonSandBox.stub(
          VersionUtils,
          'printVersion',
          noop,
        );

        VersionUtils.doIt({
          increment: 'PATCH',
          'read-only': true,
          preid: 'beta',
          'force-preid': true,
        }).catch(() => {});

        expect(incrementPackageVersionSpy.called).to.be.true;
        expect(incrementPackageVersionSpy.calledOnce).to.be.true;
        expect(
          incrementPackageVersionSpy.calledWithExactly(
            '0.0.1',
            'patch',
            'beta',
            true,
          ),
        ).to.be.true;

        expect(printVersionStub.called).to.be.true;
        expect(printVersionStub.calledOnce).to.be.true;
        expect(printVersionStub.calledWithExactly('0.0.2-beta')).to.be.true;
      });
    });

    it('should unpreid the version if the option is specified', function () {
      sinonSandBox.stub(VersionUtils, 'hasFoundPackageJsonFile', () => true);
      sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
        return { version: '0.0.1-snapshot' };
      });

      let printVersionStub = sinonSandBox.stub(
        VersionUtils,
        'printVersion',
        noop,
      );

      VersionUtils.doIt({ unpreid: true, 'read-only': true }).catch(() => {});

      expect(printVersionStub.called).to.be.true;
      expect(printVersionStub.calledOnce).to.be.true;
      expect(printVersionStub.calledWithExactly('0.0.1')).to.be.true;
    });

    describe('should use git, ', function () {
      it('and log a message if Git is not installed', function () {
        sinonSandBox.stub(VersionUtils, 'checkForGitIfNeeded', () =>
          Promise.reject(new VersionUtils.ERRORS.GitNotInstalledError()),
        );
        sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
        sinonSandBox.stub(Utils, 'promisedSpawn', () => Promise.resolve());
        sinonSandBox.stub(process, 'exit', () => {});
        let printErrorSpy = sinonSandBox.stub(
          VersionUtils,
          'printGitNotInstalledError',
          noop,
        );

        return VersionUtils.doIt({ increment: 'fake' })
          .then(function () {
            chai.fail('The then method should not be called');
          })
          .catch(function (err) {
            expect(printErrorSpy.called).to.be.true;
            expect(printErrorSpy.calledOnce).to.be.true;
          });
      });

      it('and log a message if we are not into a Git project', function () {
        sinonSandBox.stub(VersionUtils, 'checkForGitIfNeeded', () =>
          Promise.reject(new VersionUtils.ERRORS.NotAGitProjectError()),
        );
        sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
        sinonSandBox.stub(Utils, 'promisedSpawn', () => Promise.resolve());
        sinonSandBox.stub(process, 'exit', () => {});
        let printErrorSpy = sinonSandBox.stub(
          VersionUtils,
          'printNotAGitProjectError',
          noop,
        );

        return VersionUtils.doIt({ increment: 'fake' })
          .then(function () {
            chai.fail('The then method should not be called');
          })
          .catch(function (err) {
            expect(printErrorSpy.called).to.be.true;
            expect(printErrorSpy.calledOnce).to.be.true;
          });
      });

      it('and log a message if we have no remote', function () {
        sinonSandBox.stub(VersionUtils, 'doPushGitIfNeeded', () =>
          Promise.reject(new GitUtils.ERRORS.NoRemoteGitError()),
        );
        sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
        sinonSandBox.stub(Utils, 'promisedSpawn', () => Promise.resolve());
        sinonSandBox.stub(process, 'exit', () => {});
        let printErrorSpy = sinonSandBox.stub(
          VersionUtils,
          'printNoRemoteGitError',
          noop,
        );

        return VersionUtils.doIt({ increment: 'fake' })
          .then(function () {
            chai.fail('The then method should not be called');
          })
          .catch(function (err) {
            expect(printErrorSpy.called).to.be.true;
            expect(printErrorSpy.calledOnce).to.be.true;
          });
      });

      it('and log a message if we have multiple remotes', function () {
        sinonSandBox.stub(VersionUtils, 'doPushGitIfNeeded', () =>
          Promise.reject(new GitUtils.ERRORS.MultipleRemoteError()),
        );
        sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
        sinonSandBox.stub(Utils, 'promisedSpawn', () => Promise.resolve());
        sinonSandBox.stub(process, 'exit', () => {});
        let printErrorSpy = sinonSandBox.stub(
          VersionUtils,
          'printMultipleRemoteError',
          noop,
        );

        return VersionUtils.doIt({ increment: 'fake' })
          .then(function () {
            chai.fail('The then method should not be called');
          })
          .catch(function (err) {
            expect(printErrorSpy.called).to.be.true;
            expect(printErrorSpy.calledOnce).to.be.true;
          });
      });

      it('and log an error if needed', function () {
        sinonSandBox.stub(VersionUtils, 'updatePackageVersion', () =>
          Promise.reject('an error'),
        );
        sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
        sinonSandBox.stub(Utils, 'promisedSpawn', () => Promise.resolve());
        sinonSandBox.stub(process, 'exit', () => {});
        let printErrorSpy = sinonSandBox.stub(VersionUtils, 'printError', noop);

        return VersionUtils.doIt({ increment: 'fake' })
          .then(function () {
            chai.fail('The then method should not be called');
          })
          .catch(function (err) {
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
            calls.push(['updatePackageVersion'].concat(Array.from(arguments)));
            return Promise.resolve();
          });

          sinonSandBox.stub(Utils, 'promisedExec', function () {
            calls.push(['promisedExec'].concat(Array.from(arguments)));
            return Promise.resolve();
          });

          sinonSandBox.stub(Utils, 'promisedSpawn', function () {
            calls.push(['promisedSpawn'].concat(Array.from(arguments)));
            return Promise.resolve();
          });
        });

        afterEach(function () {
          calls = null;
        });

        it('create by default a commit and a tag', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({ increment: 'fake' }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
            ]);
          });
        });

        it('create the branch', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-create-branch': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git branch "release/1.2.1"', false, undefined],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
            ]);
          });
        });

        it('push the local branch, commit and the tag', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
              ['promisedExec', 'git branch -rvv', true, undefined],
              [
                'promisedExec',
                'git push --set-upstream origin release/fakeBranch',
                false,
                undefined,
              ],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                undefined,
              ],
            ]);
          });
        });

        it('push the local branch on the specified origin, commit and the tag', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
            'git-remote-name': 'anotherOrigin',
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
              ['promisedExec', 'git branch -rvv', true, undefined],
              [
                'promisedExec',
                'git push --set-upstream anotherOrigin release/fakeBranch',
                false,
                undefined,
              ],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                undefined,
              ],
            ]);
          });
        });

        it('push commit and the tag (because the local branch is associated to a remote branch)', function () {
          sinonSandBox.stub(GitUtils, 'isBranchUpstream', () =>
            Promise.resolve(true),
          );
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                undefined,
              ],
            ]);
          });
        });

        it('push commit, the branch and the tag (because the local branch is not associated to a remote branch)', function () {
          sinonSandBox.stub(GitUtils, 'isBranchUpstream', () =>
            Promise.resolve(false),
          );
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
              [
                'promisedExec',
                'git push --set-upstream origin release/fakeBranch',
                false,
                undefined,
              ],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                undefined,
              ],
            ]);
          });
        });

        it('push using the specified remote name', function () {
          sinonSandBox.stub(GitUtils, 'isBranchUpstream', () =>
            Promise.resolve(false),
          );
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
            'git-remote-name': 'anotherOrigin',
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
              [
                'promisedExec',
                'git push --set-upstream anotherOrigin release/fakeBranch',
                false,
                undefined,
              ],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                undefined,
              ],
            ]);
          });
        });

        it('push only the commit if no tag is generated', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
            'nogit-tag': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git branch -rvv', true, undefined],
              [
                'promisedExec',
                'git push --set-upstream origin release/fakeBranch',
                false,
                undefined,
              ],
              ['promisedExec', 'git push', false, undefined],
            ]);
          });
        });

        it('create no commit if specified', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return { version: '1.2.0' };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'nogit-commit': true,
            'nogit-tag': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['updatePackageVersion', '1.2.1', undefined],
            ]);
          });
        });

        it('wrap with a pre and post npm-scripts command', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return {
              version: '1.2.0',
              scripts: {
                prenpmversion: 'echo "Hello"',
                postnpmversion: 'echo "Wordl"',
              },
            };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              [
                'promisedSpawn',
                'npm',
                ['run', 'prenpmversion'],
                false,
                undefined,
              ],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedSpawn',
                'npm',
                ['run', 'postnpmversion'],
                false,
                undefined,
              ],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
              ['promisedExec', 'git branch -rvv', true, undefined],
              [
                'promisedExec',
                'git push --set-upstream origin release/fakeBranch',
                false,
                undefined,
              ],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                undefined,
              ],
            ]);
          });
        });

        it('wrap with a pre and post npm-scripts command but no execute it, because npmversion is on run scripts too', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return {
              version: '1.2.0',
              scripts: {
                prenpmversion: 'echo "Hello"',
                npmversion: 'node ./node_modules/npmversion/bin/npmversion',
                postnpmversion: 'echo "Wordl"',
              },
            };
          });

          return VersionUtils.doIt({
            increment: 'fake',
            'git-push': true,
          }).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, undefined],
              ['updatePackageVersion', '1.2.1', undefined],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                undefined,
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, undefined],
              ['promisedExec', 'git branch -rvv', true, undefined],
              [
                'promisedExec',
                'git push --set-upstream origin release/fakeBranch',
                false,
                undefined,
              ],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                undefined,
              ],
            ]);
          });
        });

        it('use the specified cwd', function () {
          sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
            return {
              version: '1.2.0',
              scripts: {
                prenpmversion: 'echo "Hello"',
                postnpmversion: 'echo "Wordl"',
              },
            };
          });

          sinonSandBox.stub(
            VersionUtils,
            'hasFoundPackageJsonFile',
            () => true,
          );

          return VersionUtils.doIt(
            { increment: 'fake', 'git-push': true },
            '/etc',
          ).then(function () {
            expect(calls).deep.equals([
              ['promisedExec', 'git --help', true],
              ['promisedExec', 'git status --porcelain', true, '/etc'],
              ['promisedSpawn', 'npm', ['run', 'prenpmversion'], false, '/etc'],
              ['updatePackageVersion', '1.2.1', '/etc'],
              [
                'promisedSpawn',
                'npm',
                ['run', 'postnpmversion'],
                false,
                '/etc',
              ],
              [
                'promisedExec',
                'git commit --all --message "Release version: 1.2.1"',
                false,
                '/etc',
              ],
              ['promisedExec', 'git tag "v1.2.1"', false, '/etc'],
              ['promisedExec', 'git branch -rvv', true, '/etc'],
              [
                'promisedExec',
                'git push --set-upstream origin release/fakeBranch',
                false,
                '/etc',
              ],
              [
                'promisedExec',
                'git push && git push --tags --no-verify',
                false,
                '/etc',
              ],
            ]);
          });
        });
      });
    });

    it('shoud deal with an arbitrary options set', function () {
      let calls = [];
      sinonSandBox.stub(VersionUtils, 'updatePackageVersion', function () {
        calls.push(['updatePackageVersion'].concat(Array.from(arguments)));
        return Promise.resolve();
      });

      sinonSandBox.stub(Utils, 'promisedExec', function () {
        calls.push(['promisedExec'].concat(Array.from(arguments)));
        return Promise.resolve();
      });

      sinonSandBox.stub(VersionUtils, 'getCurrentPackageJson', () => {
        return { version: '1.2.0' };
      });

      // Case:
      //  > npm run npmversion -- --increment patch --preid beta --nogit-tag --git-push
      // {
      //     "force-preid": true,
      //     "nogit-commit": false,
      //     "nogit-tag": true,
      //     "git-push": false,
      //     "git-commit-message": "Release version: %s",
      //     "git-tag-message": "v%s",
      //     "increment": "minor"
      // }

      return VersionUtils.doIt({
        _: [],
        help: false,
        unpreid: false,
        u: false,
        'force-preid': true,
        'read-only': false,
        'nogit-commit': false,
        'nogit-tag': true,
        'git-push': true,
        increment: 'patch',
        i: 'patch',
        preid: 'beta',
        p: 'beta',
        'git-commit-message': 'Release version: %s',
        'git-tag-message': 'v%s',
      }).then((updatedPackageVersion) => {
        expect(updatedPackageVersion).to.equal('1.2.1-beta');
        expect(calls).to.deep.equals([
          ['promisedExec', 'git --help', true],
          ['promisedExec', 'git status --porcelain', true, undefined],
          ['updatePackageVersion', '1.2.1-beta', undefined],
          [
            'promisedExec',
            'git commit --all --message "Release version: 1.2.1-beta"',
            false,
            undefined,
          ],
          ['promisedExec', 'git branch -rvv', true, undefined],
          [
            'promisedExec',
            'git push --set-upstream origin release/fakeBranch',
            false,
            undefined,
          ],
          ['promisedExec', 'git push', false, undefined],
        ]);
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
        expect(VersionUtils.unpreidPackageVersion('1.2.4-beta.0')).equal(
          '1.2.4',
        );
      });

      it('if preminor with flag is detected', function () {
        expect(VersionUtils.unpreidPackageVersion('1.3.0-beta.0')).equal(
          '1.3.0',
        );
      });

      it('if premajor with flag is detected', function () {
        expect(VersionUtils.unpreidPackageVersion('2.0.0-beta.0')).equal(
          '2.0.0',
        );
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
          expect(VersionUtils.incrementPackageVersion('1.2.3', 'patch')).equals(
            '1.2.4',
          );
        });

        it('1.2.3 --increment minor', function () {
          expect(VersionUtils.incrementPackageVersion('1.2.3', 'minor')).equals(
            '1.3.0',
          );
        });

        it('1.2.3 --increment major', function () {
          expect(VersionUtils.incrementPackageVersion('1.2.3', 'major')).equals(
            '2.0.0',
          );
        });

        it('1.2.3 --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'prerelease'),
          ).equals('1.2.4-0');
        });

        it('1.2.3 --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'prepatch'),
          ).equals('1.2.4-0');
        });

        it('1.2.3 --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'preminor'),
          ).equals('1.3.0-0');
        });

        it('1.2.3 --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'premajor'),
          ).equals('2.0.0-0');
        });
      });

      describe('With prenumber - ', function () {
        it('1.2.3-0 --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'patch'),
          ).equals('1.2.3');
        });

        it('1.2.3-0 --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'minor'),
          ).equals('1.3.0');
        });

        it('1.2.3-0 --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'major'),
          ).equals('2.0.0');
        });

        it('1.2.3-0 --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'prerelease'),
          ).equals('1.2.3-1');
        });

        it('1.2.3-0 --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch'),
          ).equals('1.2.4-0');
        });

        it('1.2.3-0 --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor'),
          ).equals('1.3.0-0');
        });

        it('1.2.3-0 --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor'),
          ).equals('2.0.0-0');
        });
      });

      describe('With preid - ', function () {
        it('1.2.3-beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch'),
          ).equals('1.2.3');
        });

        it('1.2.3-beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor'),
          ).equals('1.3.0');
        });

        it('1.2.3-beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'major'),
          ).equals('2.0.0');
        });

        it('1.2.3-beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'prerelease'),
          ).equals('1.2.3-beta.0');
        });

        it('1.2.3-beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'prepatch'),
          ).equals('1.2.4-0');
        });

        it('1.2.3-beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'preminor'),
          ).equals('1.3.0-0');
        });

        it('1.2.3-beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'premajor'),
          ).equals('2.0.0-0');
        });
      });

      describe('With prenumber and preid - ', function () {
        it('1.2.3-beta.0 --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'patch'),
          ).equals('1.2.3');
        });

        it('1.2.3-beta.0 --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'minor'),
          ).equals('1.3.0');
        });

        it('1.2.3-beta.0 --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'major'),
          ).equals('2.0.0');
        });

        it('1.2.3-beta.0 --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prerelease'),
          ).equals('1.2.3-beta.1');
        });

        it('1.2.3-beta.0 --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prepatch'),
          ).equals('1.2.4-0');
        });

        it('1.2.3-beta.0 --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'preminor'),
          ).equals('1.3.0-0');
        });

        it('1.2.3-beta.0 --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'premajor'),
          ).equals('2.0.0-0');
        });
      });
    });

    describe('should classicaly increment with the following options (where a preid flag to "beta" is set): ', function () {
      describe('Basics - ', function () {
        it('1.2.3 --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'patch', 'beta'),
          ).equals('1.2.4');
        });

        it('1.2.3 --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'minor', 'beta'),
          ).equals('1.3.0');
        });

        it('1.2.3 --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'major', 'beta'),
          ).equals('2.0.0');
        });

        it('1.2.3 --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'prerelease', 'beta'),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3 --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'prepatch', 'beta'),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3 --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'preminor', 'beta'),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3 --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3', 'premajor', 'beta'),
          ).equals('2.0.0-beta.0');
        });
      });

      describe('With prenumber - ', function () {
        it('1.2.3-0 --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'patch', 'beta'),
          ).equals('1.2.3');
        });

        it('1.2.3-0 --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'minor', 'beta'),
          ).equals('1.3.0');
        });

        it('1.2.3-0 --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'major', 'beta'),
          ).equals('2.0.0');
        });

        it('1.2.3-0 --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'prerelease',
              'beta',
            ),
          ).equals('1.2.3-beta.0');
        });

        it('1.2.3-0 --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch', 'beta'),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3-0 --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor', 'beta'),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3-0 --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor', 'beta'),
          ).equals('2.0.0-beta.0');
        });
      });

      describe('With preid - ', function () {
        it('1.2.3-beta --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch', 'beta'),
          ).equals('1.2.3');
        });

        it('1.2.3-beta --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor', 'beta'),
          ).equals('1.3.0');
        });

        it('1.2.3-beta --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion('1.2.3-beta', 'major', 'beta'),
          ).equals('2.0.0');
        });

        it('1.2.3-beta --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'prerelease',
              'beta',
            ),
          ).equals('1.2.3-beta.0');
        });

        it('1.2.3-beta --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'prepatch',
              'beta',
            ),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3-beta --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'preminor',
              'beta',
            ),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3-beta --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'premajor',
              'beta',
            ),
          ).equals('2.0.0-beta.0');
        });
      });

      describe('With prenumber and preid - ', function () {
        it('1.2.3-beta.0 --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'patch',
              'beta',
            ),
          ).equals('1.2.3');
        });

        it('1.2.3-beta.0 --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'minor',
              'beta',
            ),
          ).equals('1.3.0');
        });

        it('1.2.3-beta.0 --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'major',
              'beta',
            ),
          ).equals('2.0.0');
        });

        it('1.2.3-beta.0 --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'prerelease',
              'beta',
            ),
          ).equals('1.2.3-beta.1');
        });

        it('1.2.3-beta.0 --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'prepatch',
              'beta',
            ),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3-beta.0 --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'preminor',
              'beta',
            ),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3-beta.0 --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'premajor',
              'beta',
            ),
          ).equals('2.0.0-beta.0');
        });
      });
    });

    describe('should increment with the following options (where a preid flag to "beta" is set) and where we force to add the preid if needed: ', function () {
      describe('Basics - ', function () {
        it('1.2.3 --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3',
              'patch',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta');
        });

        it('1.2.3 --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3',
              'minor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta');
        });

        it('1.2.3 --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3',
              'major',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta');
        });

        it('1.2.3 --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3',
              'prerelease',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3 --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3',
              'prepatch',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3 --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3',
              'preminor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3 --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3',
              'premajor',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta.0');
        });
      });

      describe('With prenumber - ', function () {
        it('1.2.3-0 --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'patch',
              'beta',
              true,
            ),
          ).equals('1.2.3-beta');
        });

        it('1.2.3-0 --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'minor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta');
        });

        it('1.2.3-0 --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'major',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta');
        });

        it('1.2.3-0 --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'prerelease',
              'beta',
              true,
            ),
          ).equals('1.2.3-beta.0');
        });

        it('1.2.3-0 --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'prepatch',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3-0 --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'preminor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3-0 --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-0',
              'premajor',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta.0');
        });
      });

      describe('With preid - ', function () {
        it('1.2.3-beta --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'patch',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta');
        });

        it('1.2.3-beta --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'minor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta');
        });

        it('1.2.3-beta --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'major',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta');
        });

        it('1.2.3-beta --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'prerelease',
              'beta',
              true,
            ),
          ).equals('1.2.3-beta.0');
        });

        it('1.2.3-beta --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'prepatch',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3-beta --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'preminor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3-beta --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta',
              'premajor',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta.0');
        });
      });

      describe('With prenumber and preid - ', function () {
        it('1.2.3-beta.0 --preid beta --increment patch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'patch',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta');
        });

        it('1.2.3-beta.0 --preid beta --increment minor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'minor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta');
        });

        it('1.2.3-beta.0 --preid beta --increment major', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'major',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta');
        });

        it('1.2.3-beta.0 --preid beta --increment prerelease', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'prerelease',
              'beta',
              true,
            ),
          ).equals('1.2.3-beta.1');
        });

        it('1.2.3-beta.0 --preid beta --increment prepatch', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'prepatch',
              'beta',
              true,
            ),
          ).equals('1.2.4-beta.0');
        });

        it('1.2.3-beta.0 --preid beta --increment preminor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'preminor',
              'beta',
              true,
            ),
          ).equals('1.3.0-beta.0');
        });

        it('1.2.3-beta.0 --preid beta --increment premajor', function () {
          expect(
            VersionUtils.incrementPackageVersion(
              '1.2.3-beta.0',
              'premajor',
              'beta',
              true,
            ),
          ).equals('2.0.0-beta.0');
        });
      });
    });
  });

  describe('and the method "isNpmversionRunScriptDetectedInPackageJson" ', function () {
    it('should exist', function () {
      expect(VersionUtils.isNpmversionRunScriptDetectedInPackageJson).to.exist;
    });

    it('should return false if no content into the package.json', function () {
      expect(VersionUtils.isNpmversionRunScriptDetectedInPackageJson()).to.be
        .false;
      expect(VersionUtils.isNpmversionRunScriptDetectedInPackageJson(null)).to
        .be.false;
    });

    it('should return false there is no "scripts" property', function () {
      expect(VersionUtils.isNpmversionRunScriptDetectedInPackageJson({})).to.be
        .false;
    });

    it('should return false there is no "npmversion" property into the scripts part', function () {
      expect(
        VersionUtils.isNpmversionRunScriptDetectedInPackageJson({
          scripts: {},
        }),
      ).to.be.false;
    });

    it('should return false if "npmversion" is empty', function () {
      expect(
        VersionUtils.isNpmversionRunScriptDetectedInPackageJson({
          scripts: { npmversion: '' },
        }),
      ).to.be.false;
    });

    it('should return true otherwise', function () {
      expect(
        VersionUtils.isNpmversionRunScriptDetectedInPackageJson({
          scripts: { npmversion: 'echo "test"' },
        }),
      ).to.be.true;
    });
  });

  describe('and the method "isPostnpmversionRunScriptDetectedInPackageJson" ', function () {
    it('should exist', function () {
      expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson).to
        .exist;
    });

    it('should return false if no content into the package.json', function () {
      expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson()).to
        .be.false;
      expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson(null))
        .to.be.false;
    });

    it('should return false there is no "scripts" property', function () {
      expect(VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({})).to
        .be.false;
    });

    it('should return false there is no "postnpmversion" property into the scripts part', function () {
      expect(
        VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({
          scripts: {},
        }),
      ).to.be.false;
    });

    it('should return false if "postnpmversion" is empty', function () {
      expect(
        VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({
          scripts: { postnpmversion: '' },
        }),
      ).to.be.false;
    });

    it('should return true otherwise', function () {
      expect(
        VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson({
          scripts: { postnpmversion: 'echo "test"' },
        }),
      ).to.be.true;
    });
  });

  describe('and the method "isPreidLevel" ', function () {
    it('should exist', function () {
      expect(VersionUtils.isPreidLevel).to.exist;
    });

    it('should return false if not level is specified', function () {
      expect(VersionUtils.isPreidLevel()).to.be.false;
      expect(VersionUtils.isPreidLevel(null)).to.be.false;
    });

    describe('should return false if we are not in a pre-inc level ', function () {
      it('with cases checking', function () {
        expect(VersionUtils.isPreidLevel('major')).to.be.false;
        expect(VersionUtils.isPreidLevel('minor')).to.be.false;
        expect(VersionUtils.isPreidLevel('patch')).to.be.false;
      });

      it('without cases checking', function () {
        expect(VersionUtils.isPreidLevel('MAJOR')).to.be.false;
        expect(VersionUtils.isPreidLevel('MINOR')).to.be.false;
        expect(VersionUtils.isPreidLevel('PATCH')).to.be.false;
      });
    });

    describe('should return true if we are in a pre-inc level ', function () {
      it('with cases checking', function () {
        expect(VersionUtils.isPreidLevel('premajor')).to.be.true;
        expect(VersionUtils.isPreidLevel('preminor')).to.be.true;
        expect(VersionUtils.isPreidLevel('prepatch')).to.be.true;
        expect(VersionUtils.isPreidLevel('prerelease')).to.be.true;
      });

      it('without cases checking', function () {
        expect(VersionUtils.isPreidLevel('PREMAJOR')).to.be.true;
        expect(VersionUtils.isPreidLevel('PREMINOR')).to.be.true;
        expect(VersionUtils.isPreidLevel('PREPATCH')).to.be.true;
        expect(VersionUtils.isPreidLevel('PRERELEASE')).to.be.true;
      });
    });
  });

  describe('and the method "isPrenpmversionRunScriptDetectedInPackageJson" ', function () {
    it('should exist', function () {
      expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson).to
        .exist;
    });

    it('should return false if no content into the package.json', function () {
      expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson()).to.be
        .false;
      expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson(null))
        .to.be.false;
    });

    it('should return false there is no "scripts" property', function () {
      expect(VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({})).to
        .be.false;
    });

    it('should return false there is no "prenpmversion" property into the scripts part', function () {
      expect(
        VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({
          scripts: {},
        }),
      ).to.be.false;
    });

    it('should return false if "prenpmversion" is empty', function () {
      expect(
        VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({
          scripts: { prenpmversion: '' },
        }),
      ).to.be.false;
    });

    it('should return true otherwise', function () {
      expect(
        VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson({
          scripts: { prenpmversion: 'echo "test"' },
        }),
      ).to.be.true;
    });
  });

  describe('and the method "hasUseGit" ', function () {
    it('should exist', function () {
      expect(VersionUtils.hasUseGit).to.exist;
    });

    it('should return false if no options are passed', function () {
      expect(VersionUtils.hasUseGit()).to.be.false;
    });

    it('should return false if both committing, tagging and pushing are disabled', function () {
      expect(
        VersionUtils.hasUseGit({
          'nogit-commit': true,
          'nogit-tag': true,
          'git-push': false,
        }),
      ).to.be.false;
    });

    it('should return true otherwise', function () {
      expect(
        VersionUtils.hasUseGit({
          'nogit-commit': false,
          'nogit-tag': true,
          'git-push': false,
        }),
      ).to.be.true;
      expect(
        VersionUtils.hasUseGit({
          'nogit-commit': true,
          'nogit-tag': false,
          'git-push': false,
        }),
      ).to.be.true;
      expect(
        VersionUtils.hasUseGit({
          'nogit-commit': false,
          'nogit-tag': false,
          'git-push': false,
        }),
      ).to.be.true;
      expect(
        VersionUtils.hasUseGit({
          'nogit-commit': false,
          'nogit-tag': true,
          'git-push': true,
        }),
      ).to.be.true;
      expect(
        VersionUtils.hasUseGit({
          'nogit-commit': true,
          'nogit-tag': false,
          'git-push': true,
        }),
      ).to.be.true;
      expect(
        VersionUtils.hasUseGit({
          'nogit-commit': false,
          'nogit-tag': false,
          'git-push': true,
        }),
      ).to.be.true;
    });
  });

  describe('and the method "hashCreateCommitGit" ', function () {
    it('should exist', function () {
      expect(VersionUtils.hashCreateCommitGit).to.exist;
    });

    it('should return true if no options are passed', function () {
      expect(VersionUtils.hashCreateCommitGit()).to.be.true;
    });

    it('should return true if the option "nogit-commit" is omitted', function () {
      expect(VersionUtils.hashCreateCommitGit({})).to.be.true;
    });

    it('should return true if the option "nogit-commit" is set to false', function () {
      expect(VersionUtils.hashCreateCommitGit({ 'nogit-commit': false })).to.be
        .true;
    });

    it('should return false otherwise', function () {
      expect(VersionUtils.hashCreateCommitGit({ 'nogit-commit': true })).to.be
        .false;
    });
  });

  describe('and the method "hashCreateCommitGit" ', function () {
    it('should exist', function () {
      expect(VersionUtils.hashCreateBranchGit).to.exist;
    });

    it('should return false if no options are passed', function () {
      expect(VersionUtils.hashCreateBranchGit()).to.be.false;
    });

    it('should return false if the option "git-create-branch" is omitted', function () {
      expect(VersionUtils.hashCreateBranchGit({})).to.be.false;
    });

    it('should return false if the option "git-create-branch" is set to false', function () {
      expect(VersionUtils.hashCreateBranchGit({ 'git-create-branch': false }))
        .to.be.false;
    });

    it('should return true otherwise', function () {
      expect(VersionUtils.hashCreateBranchGit({ 'git-create-branch': true })).to
        .be.true;
    });
  });

  describe('and the method "hasIgnoreErrorJsonFile" ', function () {
    it('should exist', function () {
      expect(VersionUtils.hasIgnoreErrorJsonFile).to.exist;
    });

    it('should return false if no options are passed', function () {
      expect(VersionUtils.hasIgnoreErrorJsonFile()).to.be.false;
    });

    it('should return false if the option "ignoreErrorJsonFile" is omitted', function () {
      expect(VersionUtils.hasIgnoreErrorJsonFile({})).to.be.false;
    });

    it('should return false if the option "ignoreErrorJsonFile" is set to false', function () {
      expect(
        VersionUtils.hasIgnoreErrorJsonFile({ ignoreErrorJsonFile: false }),
      ).to.be.false;
    });

    it('should return true otherwise', function () {
      expect(VersionUtils.hasIgnoreErrorJsonFile({ ignoreErrorJsonFile: true }))
        .to.be.true;
    });
  });

  describe('and the method "hashPushCommitsGit" ', function () {
    it('should exist', function () {
      expect(VersionUtils.hashPushCommitsGit).to.exist;
    });

    it('should return false if no options are passed', function () {
      expect(VersionUtils.hashPushCommitsGit()).to.be.false;
    });

    it('should return false if the option "nogit-tag" is omitted', function () {
      expect(VersionUtils.hashPushCommitsGit({})).to.be.false;
    });

    it('should return false if the option "git-push" is set to false', function () {
      expect(VersionUtils.hashPushCommitsGit({ 'git-push': false })).to.be
        .false;
    });

    it('should return true otherwise', function () {
      expect(VersionUtils.hashPushCommitsGit({ 'git-push': true })).to.be.true;
    });
  });

  describe('and the method "createBranchGitIfNeeded" ', function () {
    it('should exist', function () {
      expect(VersionUtils.createBranchGitIfNeeded).to.exist;
    });

    it('should not create the git commit', function () {
      let hashCreateBranchGitSpy = sinonSandBox.stub(
        VersionUtils,
        'hashCreateBranchGit',
        () => false,
      );
      let createBranchSpy = sinonSandBox.stub(GitUtils, 'createCommit', () =>
        Promise.resolve(),
      );
      let fakeOptions = { preid: true };

      return VersionUtils.createBranchGitIfNeeded('1.2.3', fakeOptions).then(
        () => {
          expect(hashCreateBranchGitSpy.called).to.be.true;
          expect(hashCreateBranchGitSpy.calledOnce).to.be.true;
          expect(hashCreateBranchGitSpy.calledWithExactly(fakeOptions)).to.be
            .true;

          expect(createBranchSpy.called).to.be.false;
        },
      );
    });

    describe('should create the commit git', function () {
      it('with the default message', function () {
        let hashCreateBranchGitSpy = sinonSandBox.stub(
          VersionUtils,
          'hashCreateBranchGit',
          () => true,
        );
        let createBranchSpy = sinonSandBox.stub(GitUtils, 'createBranch', () =>
          Promise.resolve(),
        );
        let fakeOptions = { preid: true };

        return VersionUtils.createBranchGitIfNeeded('1.2.3', fakeOptions).then(
          () => {
            expect(hashCreateBranchGitSpy.called).to.be.true;
            expect(hashCreateBranchGitSpy.calledOnce).to.be.true;
            expect(hashCreateBranchGitSpy.calledWithExactly(fakeOptions)).to.be
              .true;

            expect(createBranchSpy.called).to.be.true;
            expect(createBranchSpy.calledOnce).to.be.true;
            expect(
              createBranchSpy.calledWithExactly(
                '1.2.3',
                Messages.GIT_BRANCH_MESSAGE,
                undefined,
              ),
            ).to.be.true;
          },
        );
      });

      it('with the specified message', function () {
        let hashCreateBranchGitSpy = sinonSandBox.stub(
          VersionUtils,
          'hashCreateBranchGit',
          () => true,
        );
        let createBranchSpy = sinonSandBox.stub(GitUtils, 'createBranch', () =>
          Promise.resolve(),
        );
        let fakeOptions = {
          preid: true,
          'git-branch-message': 'my custom message',
        };

        return VersionUtils.createBranchGitIfNeeded('1.2.3', fakeOptions).then(
          () => {
            expect(hashCreateBranchGitSpy.called).to.be.true;
            expect(hashCreateBranchGitSpy.calledOnce).to.be.true;
            expect(hashCreateBranchGitSpy.calledWithExactly(fakeOptions)).to.be
              .true;

            expect(createBranchSpy.called).to.be.true;
            expect(createBranchSpy.calledOnce).to.be.true;
            expect(
              createBranchSpy.calledWithExactly(
                '1.2.3',
                'my custom message',
                undefined,
              ),
            ).to.be.true;
          },
        );
      });
    });
  });

  describe('and the method "createCommitGitIfNeeded" ', function () {
    it('should exist', function () {
      expect(VersionUtils.createCommitGitIfNeeded).to.exist;
    });

    it('should not create the git commit', function () {
      let hashCreateCommitGitSpy = sinonSandBox.stub(
        VersionUtils,
        'hashCreateCommitGit',
        () => false,
      );
      let createCommitSpy = sinonSandBox.stub(GitUtils, 'createCommit', () =>
        Promise.resolve(),
      );
      let fakeOptions = { preid: true };

      return VersionUtils.createCommitGitIfNeeded('1.2.3', fakeOptions).then(
        () => {
          expect(hashCreateCommitGitSpy.called).to.be.true;
          expect(hashCreateCommitGitSpy.calledOnce).to.be.true;
          expect(hashCreateCommitGitSpy.calledWithExactly(fakeOptions)).to.be
            .true;

          expect(createCommitSpy.called).to.be.false;
        },
      );
    });

    describe('should create the commit git', function () {
      it('with the default message', function () {
        let hashCreateCommitGitSpy = sinonSandBox.stub(
          VersionUtils,
          'hashCreateCommitGit',
          () => true,
        );
        let createCommitSpy = sinonSandBox.stub(GitUtils, 'createCommit', () =>
          Promise.resolve(),
        );
        let fakeOptions = { preid: true };

        return VersionUtils.createCommitGitIfNeeded('1.2.3', fakeOptions).then(
          () => {
            expect(hashCreateCommitGitSpy.called).to.be.true;
            expect(hashCreateCommitGitSpy.calledOnce).to.be.true;
            expect(hashCreateCommitGitSpy.calledWithExactly(fakeOptions)).to.be
              .true;

            expect(createCommitSpy.called).to.be.true;
            expect(createCommitSpy.calledOnce).to.be.true;
            expect(
              createCommitSpy.calledWithExactly(
                '1.2.3',
                Messages.GIT_COMMIT_MESSAGE,
                undefined,
              ),
            ).to.be.true;
          },
        );
      });

      it('with the specified message', function () {
        let hashCreateCommitGitSpy = sinonSandBox.stub(
          VersionUtils,
          'hashCreateCommitGit',
          () => true,
        );
        let createCommitSpy = sinonSandBox.stub(GitUtils, 'createCommit', () =>
          Promise.resolve(),
        );
        let fakeOptions = {
          preid: true,
          'git-commit-message': 'my custom message',
        };

        return VersionUtils.createCommitGitIfNeeded('1.2.3', fakeOptions).then(
          () => {
            expect(hashCreateCommitGitSpy.called).to.be.true;
            expect(hashCreateCommitGitSpy.calledOnce).to.be.true;
            expect(hashCreateCommitGitSpy.calledWithExactly(fakeOptions)).to.be
              .true;

            expect(createCommitSpy.called).to.be.true;
            expect(createCommitSpy.calledOnce).to.be.true;
            expect(
              createCommitSpy.calledWithExactly(
                '1.2.3',
                'my custom message',
                undefined,
              ),
            ).to.be.true;
          },
        );
      });
    });
  });

  describe('and the method "createTagGitIfNeeded" ', function () {
    it('should exist', function () {
      expect(VersionUtils.createTagGitIfNeeded).to.exist;
    });

    it('should not create the git commit', function () {
      let hahsTagGitSpy = sinonSandBox.stub(
        VersionUtils,
        'hashCreateTagGit',
        () => false,
      );
      let createTagSpy = sinonSandBox.stub(GitUtils, 'createTag', () =>
        Promise.resolve(),
      );
      let fakeOptions = { preid: true };

      return VersionUtils.createTagGitIfNeeded('1.2.3', fakeOptions).then(
        () => {
          expect(hahsTagGitSpy.called).to.be.true;
          expect(hahsTagGitSpy.calledOnce).to.be.true;
          expect(hahsTagGitSpy.calledWithExactly(fakeOptions)).to.be.true;

          expect(createTagSpy.called).to.be.false;
        },
      );
    });

    describe('should create the commit git', function () {
      it('with the default message', function () {
        let hahsTagGitSpy = sinonSandBox.stub(
          VersionUtils,
          'hashCreateTagGit',
          () => true,
        );
        let createTagSpy = sinonSandBox.stub(GitUtils, 'createTag', () =>
          Promise.resolve(),
        );
        let fakeOptions = { preid: true };

        return VersionUtils.createTagGitIfNeeded('1.2.3', fakeOptions).then(
          () => {
            expect(hahsTagGitSpy.called).to.be.true;
            expect(hahsTagGitSpy.calledOnce).to.be.true;
            expect(hahsTagGitSpy.calledWithExactly(fakeOptions)).to.be.true;

            expect(createTagSpy.called).to.be.true;
            expect(createTagSpy.calledOnce).to.be.true;
            expect(
              createTagSpy.calledWithExactly(
                '1.2.3',
                Messages.GIT_TAG_MESSAGE,
                undefined,
              ),
            ).to.be.true;
          },
        );
      });

      it('with the specified message', function () {
        let hahsTagGitSpy = sinonSandBox.stub(
          VersionUtils,
          'hashCreateTagGit',
          () => true,
        );
        let createTagSpy = sinonSandBox.stub(GitUtils, 'createTag', () =>
          Promise.resolve(),
        );
        let fakeOptions = {
          preid: true,
          'git-tag-message': 'my custom message',
        };

        return VersionUtils.createTagGitIfNeeded('1.2.3', fakeOptions).then(
          () => {
            expect(hahsTagGitSpy.called).to.be.true;
            expect(hahsTagGitSpy.calledOnce).to.be.true;
            expect(hahsTagGitSpy.calledWithExactly(fakeOptions)).to.be.true;

            expect(createTagSpy.called).to.be.true;
            expect(createTagSpy.calledOnce).to.be.true;
            expect(
              createTagSpy.calledWithExactly(
                '1.2.3',
                'my custom message',
                undefined,
              ),
            ).to.be.true;
          },
        );
      });
    });
  });

  describe('and the method "updateJsonFilesIfNeeded" ', function () {
    it('should exist', function () {
      expect(VersionUtils.updateJsonFilesIfNeeded).to.exist;
    });

    it('should do nothing if no options are passed', function () {
      let updateJsonFileStub = sinonSandBox.stub(
        VersionUtils,
        'updateJsonFile',
        () => Promise.resolve(),
      );

      return VersionUtils.updateJsonFilesIfNeeded(null, '1.2.3').then(
        function () {
          expect(updateJsonFileStub.called).to.be.false;
        },
      );
    });

    it('should do nothing if the jsonFiles option is missing', function () {
      let updateJsonFileStub = sinonSandBox.stub(
        VersionUtils,
        'updateJsonFile',
        () => Promise.resolve(),
      );

      return VersionUtils.updateJsonFilesIfNeeded({}, '1.2.3').then(
        function () {
          expect(updateJsonFileStub.called).to.be.false;
        },
      );
    });

    it('should do nothing if the jsonFiles option is empty', function () {
      let updateJsonFileStub = sinonSandBox.stub(
        VersionUtils,
        'updateJsonFile',
        () => Promise.resolve(),
      );

      return VersionUtils.updateJsonFilesIfNeeded(
        { jsonFiles: [] },
        '1.2.3',
      ).then(function () {
        expect(updateJsonFileStub.called).to.be.false;
      });
    });

    it('should update the specified json files otherwise', function () {
      let updateJsonFileStub = sinonSandBox.stub(
        VersionUtils,
        'updateJsonFile',
        () => Promise.resolve(),
      );

      return VersionUtils.updateJsonFilesIfNeeded(
        {
          jsonFiles: [
            'bower.json',
            { file: 'component.json', property: 'version' },
          ],
        },
        '1.2.3',
      ).then(function () {
        expect(updateJsonFileStub.called).to.be.true;
        expect(updateJsonFileStub.calledTwice).to.be.true;
        expect(updateJsonFileStub.args).deep.equals([
          [
            {
              jsonFiles: [
                'bower.json',
                { file: 'component.json', property: 'version' },
              ],
            },
            '1.2.3',
            'bower.json',
            undefined,
          ],
          [
            {
              jsonFiles: [
                'bower.json',
                { file: 'component.json', property: 'version' },
              ],
            },
            '1.2.3',
            { file: 'component.json', property: 'version' },
            undefined,
          ],
        ]);
      });
    });
  });

  describe('and the method "updateJsonFile" ', function () {
    it('should exist', function () {
      expect(VersionUtils.updateJsonFile).to.exist;
    });

    describe('should around error management, ', function () {
      it('return the error if the option ignoreErrorJsonFile is not set to true', function () {
        sinonSandBox.stub(Utils, 'readFile', () => Promise.reject());

        return VersionUtils.updateJsonFile({}, '1.0.0-beta.55', {
          file: 'bower.json',
          property: 'version',
        })
          .then(() => Promise.reject('The test should fail'))
          .catch((err) => Promise.resolve('The test is a success'));
      });

      it('print a warn message if the option ignoreErrorJsonFile is set to true', function () {
        let printIgnoredJsonFile = sinonSandBox.stub(
          VersionUtils,
          'printIgnoredJsonFile',
          noop,
        );
        sinonSandBox.stub(Utils, 'readFile', () => Promise.reject());

        return VersionUtils.updateJsonFile(
          { ignoreErrorJsonFile: true },
          '1.0.0-beta.55',
          { file: 'bower.json', property: 'version' },
        ).then(() => {
          expect(printIgnoredJsonFile.called).to.be.true;
          expect(printIgnoredJsonFile.calledOnce).to.be.true;
        });
      });
    });

    describe('should find the bower.json based ', function () {
      it('on the current CWD', function () {
        sinonSandBox.stub(Utils, 'readFile', () => Promise.reject());
        VersionUtils.updateJsonFile(null, null, {
          file: 'bower.json',
          property: 'version',
        }).catch(() => {});

        expect(
          Utils.readFile.calledWithExactly(
            path.resolve(process.cwd() + '/bower.json'),
          ),
        ).to.be.true;
      });

      it('on the specified CWD', function () {
        sinonSandBox.stub(Utils, 'readFile', () => Promise.reject());
        VersionUtils.updateJsonFile(
          null,
          null,
          { file: 'bower.json', property: 'version' },
          '/etc',
        ).catch(() => {});

        expect(
          Utils.readFile.calledWithExactly(
            path.resolve(path.join('/etc', 'bower.json')),
          ),
        ).to.be.true;
      });
    });

    describe('should update the version property, save the json file ', function () {
      it('and add it into git if activated', function () {
        sinonSandBox.stub(process, 'cwd', () => '/path/temp');

        let readFileStub = sinonSandBox.stub(Utils, 'readFile', function () {
          return Promise.resolve('{"version":"1.2.3"}');
        });
        let writeFileStub = sinonSandBox.stub(Utils, 'writeFile', function () {
          return Promise.resolve();
        });
        let addFileStub = sinonSandBox.stub(GitUtils, 'addFile', function () {
          return Promise.resolve();
        });
        let replaceJsonVersionPropertySpy = sinonSandBox.spy(
          Utils,
          'replaceJsonVersionProperty',
        );

        return VersionUtils.updateJsonFile({}, '3.2.1', 'bower.json').then(
          function () {
            expect(readFileStub.args.length).equals(1);
            expect(readFileStub.args[0].length).equals(1);
            expect(readFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
              '/path/temp/bower.json',
            );

            expect(replaceJsonVersionPropertySpy.args).deep.equals([
              ['{"version":"1.2.3"}', '3.2.1'],
            ]);
            expect(replaceJsonVersionPropertySpy.returnValues).deep.equals([
              '{"version":"3.2.1"}',
            ]);

            expect(writeFileStub.args.length).equals(1);
            expect(writeFileStub.args[0].length).equals(2);
            expect(writeFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
              '/path/temp/bower.json',
            );
            expect(writeFileStub.args[0][1]).deep.equals('{"version":"3.2.1"}');
            expect(addFileStub.args).deep.equals([['bower.json', undefined]]);
          },
        );
      });

      it('and not add it into git if not activated', function () {
        sinonSandBox.stub(process, 'cwd', () => '/path/temp');

        let readFileStub = sinonSandBox.stub(Utils, 'readFile', function () {
          return Promise.resolve('{"version":"1.2.3"}');
        });
        let writeFileStub = sinonSandBox.stub(Utils, 'writeFile', function () {
          return Promise.resolve();
        });
        let addFileStub = sinonSandBox.stub(GitUtils, 'addFile', function () {
          return Promise.resolve();
        });
        let replaceJsonVersionPropertySpy = sinonSandBox.spy(
          Utils,
          'replaceJsonVersionProperty',
        );

        return VersionUtils.updateJsonFile(
          { 'nogit-commit': true, 'nogit-tag': true, 'git-push': false },
          '3.2.1',
          'bower.json',
        ).then(function () {
          expect(readFileStub.args.length).equals(1);
          expect(readFileStub.args[0].length).equals(1);
          expect(readFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
            '/path/temp/bower.json',
          );

          expect(replaceJsonVersionPropertySpy.args).deep.equals([
            ['{"version":"1.2.3"}', '3.2.1'],
          ]);
          expect(replaceJsonVersionPropertySpy.returnValues).deep.equals([
            '{"version":"3.2.1"}',
          ]);

          expect(writeFileStub.args.length).equals(1);
          expect(writeFileStub.args[0].length).equals(2);
          expect(writeFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
            '/path/temp/bower.json',
          );
          expect(writeFileStub.args[0][1]).deep.equals('{"version":"3.2.1"}');

          expect(addFileStub.called).to.be.false;
        });
      });
    });

    describe('should update the specified property, save the json file ', function () {
      it('and add it into git if activated', function () {
        sinonSandBox.stub(process, 'cwd', () => '/path/temp');

        let readFileStub = sinonSandBox.stub(Utils, 'readFile', function () {
          return Promise.resolve('{"specified":"1.2.3"}');
        });
        let writeFileStub = sinonSandBox.stub(Utils, 'writeFile', function () {
          return Promise.resolve();
        });
        let addFileStub = sinonSandBox.stub(GitUtils, 'addFile', function () {
          return Promise.resolve();
        });
        let replaceJsonPropertySpy = sinonSandBox.spy(
          Utils,
          'replaceJsonProperty',
        );

        return VersionUtils.updateJsonFile({}, '3.2.1', {
          file: 'bower.json',
          property: 'specified',
        }).then(function () {
          expect(readFileStub.args.length).equals(1);
          expect(readFileStub.args[0].length).equals(1);
          expect(readFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
            '/path/temp/bower.json',
          );

          expect(replaceJsonPropertySpy.args).deep.equals([
            ['{"specified":"1.2.3"}', 'specified', '3.2.1'],
          ]);
          expect(replaceJsonPropertySpy.returnValues).deep.equals([
            '{"specified":"3.2.1"}',
          ]);

          expect(writeFileStub.args.length).equals(1);
          expect(writeFileStub.args[0].length).equals(2);
          expect(writeFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
            '/path/temp/bower.json',
          );
          expect(writeFileStub.args[0][1]).deep.equals('{"specified":"3.2.1"}');
          expect(addFileStub.args).deep.equals([['bower.json', undefined]]);
        });
      });

      it('and not add it into git if not activated', function () {
        sinonSandBox.stub(process, 'cwd', () => '/path/temp');

        let readFileStub = sinonSandBox.stub(Utils, 'readFile', function () {
          return Promise.resolve('{"specified":"1.2.3"}');
        });
        let writeFileStub = sinonSandBox.stub(Utils, 'writeFile', function () {
          return Promise.resolve();
        });
        let addFileStub = sinonSandBox.stub(GitUtils, 'addFile', function () {
          return Promise.resolve();
        });
        let replaceJsonPropertySpy = sinonSandBox.spy(
          Utils,
          'replaceJsonProperty',
        );

        return VersionUtils.updateJsonFile(
          { 'nogit-commit': true, 'nogit-tag': true, 'git-push': false },
          '3.2.1',
          { file: 'bower.json', property: 'specified' },
        ).then(function () {
          expect(readFileStub.args.length).equals(1);
          expect(readFileStub.args[0].length).equals(1);
          expect(readFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
            '/path/temp/bower.json',
          );

          expect(replaceJsonPropertySpy.args).deep.equals([
            ['{"specified":"1.2.3"}', 'specified', '3.2.1'],
          ]);
          expect(replaceJsonPropertySpy.returnValues).deep.equals([
            '{"specified":"3.2.1"}',
          ]);

          expect(writeFileStub.args.length).equals(1);
          expect(writeFileStub.args[0].length).equals(2);
          expect(writeFileStub.args[0][0].replace(/\\/g, '/')).deep.equals(
            '/path/temp/bower.json',
          );
          expect(writeFileStub.args[0][1]).deep.equals('{"specified":"3.2.1"}');

          expect(addFileStub.called).to.be.false;
        });
      });
    });
  });
});

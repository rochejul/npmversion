/**
 * Git utils tests
 *
 * @module test/git-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

describe(`GitUtils  - `, function () {
    const expect = require('chai').expect;
    const sinon = require('sinon');
    const GitUtils =  require('../lib/git');
    const Utils =  require('../lib/utils');

    let sinonSandBox = null;

    it('should exports something', function () {
        expect(GitUtils).to.exist;
    });

    describe('and the method "createBranchLabel" ', function () {
        it('should exist', function () {
            expect(GitUtils.createBranchLabel).to.exist;
        });

        it('should return a default value if no label set', function () {
            expect(GitUtils.createBranchLabel('1.2.3')).equals('release/1.2.3');
        });

        it('should inject the package version if a label is set', function () {
            expect(GitUtils.createBranchLabel('1.2.3', 'releases/%s')).equals('releases/1.2.3');
        });
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

    beforeEach(function () {
        sinonSandBox = sinon.sandbox.create();
    });

    afterEach(function () {
        sinonSandBox && sinonSandBox.restore();
        sinonSandBox = null;
    });

    describe('and the method "hasGitInstalled" ', function () {
        it('should exist', function () {
            expect(GitUtils.hasGitInstalled).to.exist;
        });

        it('should return false if the git command is not recognized', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.reject('command not recognized'));

            return GitUtils
                .hasGitInstalled()
                .then(function (status) {
                    expect(status).to.be.false;
                });
        });

        it('should return true otherwise', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .hasGitInstalled()
                .then(function (status) {
                    expect(status).to.be.true;
                });
        });
    });

    describe('and the method "hasGitProject" ', function () {
        it('should exist', function () {
            expect(GitUtils.hasGitProject).to.exist;
        });

        it('should return false if the cwd is not into a git project', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.reject('fatal: Not a git repository (or any of the parent directories): .git'));

            return GitUtils
                .hasGitProject()
                .then(function (status) {
                    expect(status).to.be.false;
                });
        });

        it('should return true otherwise', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .hasGitProject()
                .then(function (status) {
                    expect(status).to.be.true;
                });
        });

        it('should use per default the process.cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .hasGitProject()
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git status --porcelain', true, undefined)).to.be.true;
                });
        });

        it('should use  the specified cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .hasGitProject('/etc')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git status --porcelain', true, '/etc')).to.be.true;
                });
        });
    });

    describe('and the method "getBranchName" ', function () {
        it('should exist', function () {
            expect(GitUtils.getBranchName).to.exist;
        });

        it('should return the branch name', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve('releases/1.0.0'));

            return GitUtils
                .getBranchName()
                .then(function (remoteName) {
                    expect(remoteName).equals('releases/1.0.0');
                });
        });

        it('should ignore some carriage return', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve('releases/1.0.0\n'));

            return GitUtils
                .getBranchName()
                .then(function (remoteName) {
                    expect(remoteName).equals('releases/1.0.0');
                });
        });

        it('should raise the exception NoBranchGitError if no branch was detected', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(''));

            return GitUtils
                .getBranchName()
                .then(() => Promise.reject('Should not be resolved'))
                .catch(function (err) {
                    expect(err).to.exist;
                    expect(err instanceof Error).to.be.true;
                    expect(err.name).to.equals('NoBranchGitError');
                });
        });

        it('should use the specified cwd', function () {
            let getBranchNameStub = sinonSandBox.stub(GitUtils, 'getBranchName', () => Promise.resolve('releases/1.0.0'));

            return GitUtils
                .getBranchName('/etc')
                .then(function () {
                    expect(getBranchNameStub.calledWithExactly('/etc')).to.be.true;
                });
        });
    });

    describe('and the method "getRemoteName" ', function () {
        it('should exist', function () {
            expect(GitUtils.getRemoteName).to.exist;
        });

        it('should return the origin name', function () {
            sinonSandBox.stub(GitUtils, 'getRemoteNameList', () => Promise.resolve(['origin']));

            return GitUtils
                .getRemoteName()
                .then(function (remoteName) {
                    expect(remoteName).equals('origin');
                });
        });

        it('should raise the exception NoRemoteGitError if no remotes were detected', function () {
            sinonSandBox.stub(GitUtils, 'getRemoteNameList', () => Promise.resolve([]));

            return GitUtils
                .getRemoteName()
                .then(() => Promise.reject('Should not be resolved'))
                .catch(function (err) {
                    expect(err).to.exist;
                    expect(err instanceof Error).to.be.true;
                    expect(err.name).to.equals('NoRemoteGitError');
                });
        });

        it('should raise the exception MultipleRemoteError if no remotes were detected', function () {
            sinonSandBox.stub(GitUtils, 'getRemoteNameList', () => Promise.resolve(['origin', 'anotherRemote']));

            return GitUtils
                .getRemoteName()
                .then(() => Promise.reject('Should not be resolved'))
                .catch(function (err) {
                    expect(err).to.exist;
                    expect(err instanceof Error).to.be.true;
                    expect(err.name).to.equals('MultipleRemoteError');
                });
        });

        it('should use the specified cwd', function () {
            let getRemoteNameListStub = sinonSandBox.stub(GitUtils, 'getRemoteNameList', () => Promise.resolve(['origin']));

            return GitUtils
                .getRemoteName('/etc')
                .then(function () {
                    expect(getRemoteNameListStub.calledWithExactly('/etc')).to.be.true;
                });
        });
    });

    describe('and the method "getRemoteNameList" ', function () {
        it('should exist', function () {
            expect(GitUtils.getRemoteNameList).to.exist;
        });

        it('should return the remote names (1)', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(''));

            return GitUtils
                .getRemoteNameList()
                .then(function (remoteNames) {
                    expect(remoteNames).deep.equals([]);
                });
        });

        it('should return the remote names (2)', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve('origin'));

            return GitUtils
                .getRemoteNameList()
                .then(function (remoteNames) {
                    expect(remoteNames).deep.equals(['origin']);
                });
        });

        it('should return the remote names (3)', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(`origin
anotherRemote`));

            return GitUtils
                .getRemoteNameList()
                .then(function (remoteNames) {
                    expect(remoteNames).deep.equals(['origin', 'anotherRemote']);
                });
        });

        it('should use the specified cwd', function () {
            let getRemoteNameListStub = sinonSandBox.stub(GitUtils, 'getRemoteNameList', () => Promise.resolve('origin'));

            return GitUtils
                .getRemoteNameList('/etc')
                .then(function () {
                    expect(getRemoteNameListStub.calledWithExactly('/etc')).to.be.true;
                });
        });
    });

    describe('and the method "isCurrentBranchUpstream" ', function () {
        it('should exist', function () {
            expect(GitUtils.isCurrentBranchUpstream).to.exist;
        });

        it('should raise the exception NoBranchGitError if no branch was detected', function () {
            sinonSandBox.stub(GitUtils, 'getBranchName', () => Promise.reject(new GitUtils.ERRORS.NoBranchGitError()));

            return GitUtils
                .isCurrentBranchUpstream()
                .then(() => Promise.reject('Should not be resolved'))
                .catch(function (err) {
                    expect(err).to.exist;
                    expect(err instanceof Error).to.be.true;
                    expect(err.name).to.equals('NoBranchGitError');
                });
        });

        it('should return false if the current branch is not linked to a remote branch', function () {
            sinonSandBox.stub(GitUtils, 'getBranchName', () => Promise.resolve('releases/1.0.0'));
            sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));
            sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(`origin/HEAD          -> origin/master
  origin/master        ec904e9 Last commiy
  origin/releases/0.9.0 f35d72b use of babel-preset-env instead
`));

            return GitUtils
                .isCurrentBranchUpstream()
                .then(isUpstream => {
                    expect(isUpstream).to.be.false;
                });
        });

        it('should return true if the current branch is linked to a remote branch', function () {
            sinonSandBox.stub(GitUtils, 'getBranchName', () => Promise.resolve('releases/1.0.0'));
            sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));
            sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(`origin/HEAD          -> origin/master
  origin/master        ec904e9 Last commiy
  origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`));

            return GitUtils
                .isCurrentBranchUpstream()
                .then(isUpstream => {
                    expect(isUpstream).to.be.true;
                });
        });

        it('should use the specified origin', function () {
            let getBranchName =  sinonSandBox.stub(GitUtils, 'getBranchName', () => Promise.resolve('releases/1.0.0'));
            let getRemoteName = sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .isCurrentBranchUpstream('anotherOrigin', '/etc')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git branch -rvv', true, '/etc')).to.be.true;
                    expect(getBranchName.calledWithExactly('/etc')).to.be.true;
                    expect(getRemoteName.calledWithExactly('/etc')).to.be.false;
                });
        });

        it('should use the specified cwd', function () {
            let getBranchName =  sinonSandBox.stub(GitUtils, 'getBranchName', () => Promise.resolve('releases/1.0.0'));
            let getRemoteName = sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .isCurrentBranchUpstream(null, '/etc')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git branch -rvv', true, '/etc')).to.be.true;
                    expect(getBranchName.calledWithExactly('/etc')).to.be.true;
                    expect(getRemoteName.calledWithExactly('/etc')).to.be.true;
                });
        });
    });

    describe('and the method "isBranchUpstream" ', function () {
        it('should exist', function () {
            expect(GitUtils.isBranchUpstream).to.exist;
        });

        it('should return false if an error occured (1)', function () {
            sinonSandBox.stub(Utils, 'promisedExec', () => Promise.reject());
            sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));

            return GitUtils
                .isBranchUpstream('releases/1.0.0')
                .then(function (isBranchUpstream) {
                    expect(isBranchUpstream).to.be.false;
                });
        });

        it('should return false if an error occured (2)', function () {
            sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(''));
            sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.reject());

            return GitUtils
                .isBranchUpstream('releases/1.0.0')
                .then(function (isBranchUpstream) {
                    expect(isBranchUpstream).to.be.false;
                });
        });

        it('should return false if no remote branches', function () {
            sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(''));
            sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));

            return GitUtils
                .isBranchUpstream('releases/1.0.0')
                .then(function (isBranchUpstream) {
                    expect(isBranchUpstream).to.be.false;
                });
        });

        it('should return false if the local branch has no associated remote branch', function () {
            sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(`origin/HEAD          -> origin/master
  origin/master        ec904e9 Last commiy
  origin/releases/0.9.0 f35d72b use of babel-preset-env instead
`));
            sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));

            return GitUtils
                .isBranchUpstream('releases/1.0.0')
                .then(function (isBranchUpstream) {
                    expect(isBranchUpstream).to.be.false;
                });
        });

        it('should return true otherwise', function () {
            sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve(`origin/HEAD          -> origin/master
  origin/master        ec904e9 Last commiy
  origin/releases/1.0.0 f35d72b use of babel-preset-env instead
`));
            sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));

            return GitUtils
                .isBranchUpstream('releases/1.0.0')
                .then(function (isBranchUpstream) {
                    expect(isBranchUpstream).to.be.true;
                });
        });

        it('should use the specified origine', function () {
            let getRemoteName = sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .isBranchUpstream('releases/1.0.0', 'anotherOrigin')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git branch -rvv', true, '/etc')).to.be.false;
                });
        });

        it('should use the specified cwd', function () {
            let getRemoteName = sinonSandBox.stub(GitUtils, 'getRemoteName', () => Promise.resolve('origin'));
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .isBranchUpstream('releases/1.0.0', null, '/etc')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git branch -rvv', true, '/etc')).to.be.true;
                    expect(getRemoteName.calledWithExactly('/etc')).to.be.true;
                });
        });
    });

    describe('and the method "push" ', function () {
        it('should exist', function () {
            expect(GitUtils.push).to.exist;
        });

        it('should not push the tags if not specified', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .push(false)
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git push', false, undefined)).to.be.true;
                });
        });

        it('should push the tags otherwise', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .push(true)
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git push && git push --tags', false, undefined)).to.be.true;
                });
        });

        it('should use per default the process.cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .push(false)
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git push', false, undefined)).to.be.true;
                });
        });

        it('should use  the specified cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .push(false, '/etc')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git push', false, '/etc')).to.be.true;
                });
        });
    });

    describe('and the method "addFile" ', function () {
        it('should exist', function () {
            expect(GitUtils.addFile).to.exist;
        });

        it('should create add the file in git', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .addFile('bower.json')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git add bower.json', false, undefined)).to.be.true;
                });
        });

        it('should use per default the process.cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .addFile('bower.json')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git add bower.json', false, undefined)).to.be.true;
                });
        });

        it('should use  the specified cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .addFile('bower.json', '/etc')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git add bower.json', false, '/etc')).to.be.true;
                });
        });
    });

    describe('and the method "createBranch" ', function () {
        it('should exist', function () {
            expect(GitUtils.createBranch).to.exist;
        });

        it('should create a git commit', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .createBranch('1.2.3', 'releases/%s')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git branch "releases/1.2.3"', false, undefined)).to.be.true;
                });
        });

        it('should use per default the process.cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .createBranch('1.2.3', 'releases/%s')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git branch "releases/1.2.3"', false, undefined)).to.be.true;
                });
        });

        it('should use  the specified cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .createBranch('1.2.3', 'releases/%s', '/etc')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git branch "releases/1.2.3"', false, '/etc')).to.be.true;
                });
        });
    });

    describe('and the method "createCommit" ', function () {
        it('should exist', function () {
            expect(GitUtils.createCommit).to.exist;
        });

        it('should create a git commit', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .createCommit('1.2.3', 'Change version to %s')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git commit --all --message "Change version to 1.2.3"', false, undefined)).to.be.true;
                });
        });

        it('should use per default the process.cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .createCommit('1.2.3', 'Change version to %s')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git commit --all --message "Change version to 1.2.3"', false, undefined)).to.be.true;
                });
        });

        it('should use  the specified cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .createCommit('1.2.3', 'Change version to %s', '/etc')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git commit --all --message "Change version to 1.2.3"', false, '/etc')).to.be.true;
                });
        });
    });

    describe('and the method "createTag" ', function () {
        it('should exist', function () {
            expect(GitUtils.createTag).to.exist;
        });

        it('should create a git tag', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .createTag('1.2.3', 'v%s')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git tag "v1.2.3"', false, undefined)).to.be.true;
                });
        });

        it('should use per default the process.cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .createTag('1.2.3', 'v%s')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git tag "v1.2.3"', false, undefined)).to.be.true;
                });
        });

        it('should use  the specified cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());
            return GitUtils
                .createTag('1.2.3', 'v%s', '/etc')
                .then(() => {
                    expect(promiseExecStub.calledWithExactly('git tag "v1.2.3"', false, '/etc')).to.be.true;
                });
        });
    });

    describe('and the method "upstreamBranch" ', function () {
        it('should exist', function () {
            expect(GitUtils.upstreamBranch).to.exist;
        });

        it('should push the branch to remote', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .upstreamBranch('origin', 'releases/1.0.0')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git push --set-upstream origin releases/1.0.0', false, undefined)).to.be.true;
                });
        });

        it('should use the specified cwd', function () {
            let promiseExecStub = sinonSandBox.stub(Utils, 'promisedExec', () => Promise.resolve());

            return GitUtils
                .upstreamBranch('origin', 'releases/1.0.0', '/etc')
                .then(function () {
                    expect(promiseExecStub.calledWithExactly('git push --set-upstream origin releases/1.0.0', false, '/etc')).to.be.true;
                });
        });
    });
});

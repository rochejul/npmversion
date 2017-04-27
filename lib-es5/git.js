/**
 * Git utilities class
 *
 * @module lib/git
 * @exports GitUtils
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var os = require('os');
var Utils = require('./utils');

// Constants
var ESCAPE_DOUBLE_QUOTE = '\\"';
var REGEX = {
    'PURCENTAGE_STRING': /%s/g,
    'DOUBLE_QUOTE': /"/g
};

// Here the class
module.exports = function () {
    function GitUtils() {
        _classCallCheck(this, GitUtils);
    }

    _createClass(GitUtils, null, [{
        key: 'addFile',

        /**
         * @param {string} filePath
         * @param {string} [cwd]
         * @returns {Promise}
         */
        value: function addFile(filePath, cwd) {
            return Utils.promisedExec('git add ' + filePath, false, cwd);
        }

        /**
         * Create a commit git
         * @param {string} packageVersion
         * @param {string} [label]
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'createCommit',
        value: function createCommit(packageVersion, label, cwd) {
            return Utils.promisedExec('git commit --all --message "' + GitUtils.createCommitLabel(packageVersion, label) + '"', false, cwd);
        }

        /**
         * Generate the commit description
         * @param {string} packageVersion
         * @param {string} [label]
         * @returns {string}
         */

    }, {
        key: 'createCommitLabel',
        value: function createCommitLabel(packageVersion, label) {
            if (label) {
                return label.replace(REGEX.PURCENTAGE_STRING, packageVersion).replace(REGEX.DOUBLE_QUOTE, ESCAPE_DOUBLE_QUOTE);
            }

            return 'Release version: ' + packageVersion;
        }

        /**
         * Create a tag git
         * @param {string} packageVersion
         * @param {string} [label]
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'createTag',
        value: function createTag(packageVersion, label, cwd) {
            return Utils.promisedExec('git tag "' + GitUtils.createTagLabel(packageVersion, label) + '"', false, cwd);
        }

        /**
         * Generate the tag description
         * @param {string} packageVersion
         * @param {string} [label]
         * @returns {string}
         */

    }, {
        key: 'createTagLabel',
        value: function createTagLabel(packageVersion, label) {
            if (label) {
                return label.replace(REGEX.PURCENTAGE_STRING, packageVersion).replace(REGEX.DOUBLE_QUOTE, ESCAPE_DOUBLE_QUOTE);
            }

            return 'v' + packageVersion;
        }

        /**
         * @returns {Promise.<boolean>}
         */

    }, {
        key: 'hasGitInstalled',
        value: function hasGitInstalled() {
            return Utils.promisedExec('git --help', true).then(function () {
                return true;
            }).catch(function () {
                return false;
            });
        }

        /**
         * @param {string} [cwd]
         * @returns {Promise.<boolean>}
         */

    }, {
        key: 'hasGitProject',
        value: function hasGitProject(cwd) {
            return Utils.promisedExec('git status --porcelain', true, cwd).then(function () {
                return true;
            }).catch(function () {
                return false;
            });
        }

        /**
         * @param {string} [cwd]
         * @returns {Promise.<string>}
         */

    }, {
        key: 'getBranchName',
        value: function getBranchName(cwd) {
            return Utils.promisedExec('git rev-parse --abbrev-ref HEAD', true, cwd);
        }

        /**
         * @param {string} [cwd]
         * @returns {Promise.<string>}
         */

    }, {
        key: 'getRemoteName',
        value: function getRemoteName(cwd) {
            return Utils.promisedExec('git origin', true, cwd);
        }

        /**
         * @param {string} branchName
         * @param {string} [cwd]
         * @returns {Promise.<boolean>}
         */

    }, {
        key: 'isBranchUpstream',
        value: function isBranchUpstream(branchName, cwd) {
            return Promise.all([Utils.promisedExec('git branch -rvv', true, cwd), GitUtils.getRemoteName(cwd)]).then(function (results) {
                var remoteBrancheLines = results[0].split(os.EOL);
                var remoteName = results[1];
                var remoteBranch = remoteName + '/' + branchName;

                return remoteBrancheLines.find(function (remoteBranchLine) {
                    return remoteBranchLine.contains(remoteBranch);
                });
            }).then(function (remoteBranchLine) {
                return !!remoteBranchLine;
            }).catch(function () {
                return false;
            });
        }

        /**
         * Push the commits and the tags if needed
         * @param {boolean} [tags=false]
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'push',
        value: function push(tags, cwd) {
            return Utils.promisedExec('git push' + (tags ? ' && git push --tags' : ''), false, cwd);
        }

        /**
         * Push the current branch if needed
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'upstreamCurrentBranch',
        value: function upstreamCurrentBranch(cwd) {
            return Promise.all([GitUtils.getRemoteName(cwd), GitUtils.getBranchName(cwd)]).then(function (infos) {
                var remoteName = infos[0];
                var branchName = infos[1];

                return Utils.promisedExec('git push --set-upstream ' + remoteName + ' ' + branchName, false, cwd);
            });
        }
    }]);

    return GitUtils;
}();
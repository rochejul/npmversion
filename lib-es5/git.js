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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = require('./utils');

// Constants
var ESCAPE_DOUBLE_QUOTE = '\\"';
var REGEX = {
    'PURCENTAGE_STRING': /%s/g,
    'DOUBLE_QUOTE': /"/g
};

var ERRORS = Object.freeze({
    'NoRemoteGitError': function (_Error) {
        _inherits(NoRemoteGitError, _Error);

        function NoRemoteGitError() {
            _classCallCheck(this, NoRemoteGitError);

            var _this = _possibleConstructorReturn(this, (NoRemoteGitError.__proto__ || Object.getPrototypeOf(NoRemoteGitError)).call(this, 'No remote Git seems to be declared'));

            _this.name = 'NoRemoteGitError';
            return _this;
        }

        return NoRemoteGitError;
    }(Error),
    'MultipeRemoteGitError': function (_Error2) {
        _inherits(MultipeRemoteGitError, _Error2);

        function MultipeRemoteGitError() {
            _classCallCheck(this, MultipeRemoteGitError);

            var _this2 = _possibleConstructorReturn(this, (MultipeRemoteGitError.__proto__ || Object.getPrototypeOf(MultipeRemoteGitError)).call(this, 'Multiple remote Git have been detected'));

            _this2.name = 'MultipeRemoteGitError';
            return _this2;
        }

        return MultipeRemoteGitError;
    }(Error)
});

// Here the class

var GitUtils = function () {
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
         * @returns {Promise.<string | NoRemoteGitError | MultipeRemoteGitError>}
         */

    }, {
        key: 'getRemoteName',
        value: function getRemoteName(cwd) {
            return GitUtils.getRemoteNameList(cwd).then(function (remotes) {
                if (remotes.length === 1) {
                    return remotes[0];
                } else if (remotes.length > 1) {
                    return Promise.reject(new ERRORS.MultipeRemoteGitError());
                }

                return Promise.reject(new ERRORS.NoRemoteGitError());
            });
        }

        /**
         * @param {string} [cwd]
         * @returns {Promise.<string[]>}
         */

    }, {
        key: 'getRemoteNameList',
        value: function getRemoteNameList(cwd) {
            return Utils.promisedExec('git origin', true, cwd).then(function (ouputData) {
                return Utils.splitByEndOfLine(ouputData);
            });
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
                var remoteBrancheLines = Utils.splitByEndOfLine(results[0]);
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
         * Push the branch if needed
         * @maran {string} remoteName
         * @maran {string} branchName
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'upstreamBranch',
        value: function upstreamBranch(remoteName, branchName, cwd) {
            return Utils.promisedExec('git push --set-upstream ' + remoteName + ' ' + branchName, false, cwd);
        }
    }]);

    return GitUtils;
}();

;

/**
 * @name ERRORS
 * @memberof GitUtils
 */
Object.defineProperty(GitUtils, 'ERRORS', { 'writable': false, 'value': ERRORS });

module.exports = GitUtils;
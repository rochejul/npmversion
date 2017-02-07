/**
 * Version utilities class
 *
 * @module lib/version
 * @exports VersionUtils
 * @author Julien Roche
 * @version 1.2.0
 * @since 0.0.1
 */

'use strict';

// Imports

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');
var fs = require('fs');

var semver = require('semver');
var json5 = require('json5');

var Utils = require('./utils');
var GitUtils = require('./git');
var messages = require('./messages');

// Constants
var PACKAGE_JSON_FILENAME = 'package.json';
var PACKAGE_JSON = require('../' + PACKAGE_JSON_FILENAME);

var PREFIX_SEPARATOR = '-';
var PRE_LEVEL_SUFFIX = 'pre';

var LEVEL_ENUM = {
    'major': 'major',
    'minor': 'minor',
    'patch': 'patch',
    'premajor': 'premajor',
    'preminor': 'preminor',
    'prepatch': 'prepatch',
    'prerelease': 'prerelease'
};

var NUMBER_REGEXP = /^\d+$/;

var ERRORS = Object.freeze({
    'GitNotInstalledError': function (_Error) {
        _inherits(GitNotInstalledError, _Error);

        function GitNotInstalledError() {
            _classCallCheck(this, GitNotInstalledError);

            var _this = _possibleConstructorReturn(this, (GitNotInstalledError.__proto__ || Object.getPrototypeOf(GitNotInstalledError)).call(this, 'Git seems not be to be installed'));

            _this.name = 'GitNotInstalledError';
            return _this;
        }

        return GitNotInstalledError;
    }(Error),
    'NotAGitProjectError': function (_Error2) {
        _inherits(NotAGitProjectError, _Error2);

        function NotAGitProjectError() {
            _classCallCheck(this, NotAGitProjectError);

            var _this2 = _possibleConstructorReturn(this, (NotAGitProjectError.__proto__ || Object.getPrototypeOf(NotAGitProjectError)).call(this, 'It seems there is not initialized git project'));

            _this2.name = 'NotAGitProjectError';
            return _this2;
        }

        return NotAGitProjectError;
    }(Error)
});

// Class documentation

/**
 * @class VersionOptions
 * @property {boolean} [help=false]
 * @property {boolean} [unpreid=false]
 * @property {boolean} [force-preid=false]
 * @property {boolean} [read-only=false]
 * @property {boolean} [no-git-commit=false]
 * @property {boolean} [no-git-tag=false]
 * @property {boolean} [git-push=false]
 * @property {string} [increment=LEVEL_ENUM.patch]
 * @property {string} [preid]
 * @property {string} [git-commit-message]
 * @property {string} [git-tag-message]
 * @property {string[]} [jsonFiles] Relative paths from the package.json to update files with a "version" property
 */

// Here the class

var VersionUtils = function () {
    function VersionUtils() {
        _classCallCheck(this, VersionUtils);
    }

    _createClass(VersionUtils, null, [{
        key: 'checkForGitIfNeeded',

        /**
         * @param {VersionOptions} options
         * @param {string} [cwd]
         * @returns {Promise}
         */
        value: function checkForGitIfNeeded(options, cwd) {
            if (VersionUtils.hasUseGit(options)) {
                return GitUtils.hasGitInstalled().then(function (state) {
                    if (!state) {
                        return Promise.reject(new ERRORS.GitNotInstalledError());
                    }

                    return GitUtils.hasGitProject(cwd);
                }).then(function (state) {
                    if (!state) {
                        return Promise.reject(new ERRORS.NotAGitProjectError());
                    }

                    return Promise.resolve();
                });
            }

            return Promise.resolve();
        }

        /**
         * @param {string} packageJsonVersion
         * @param {VersionOptions} options
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'createCommitGitIfNeeded',
        value: function createCommitGitIfNeeded(packageJsonVersion, options, cwd) {
            if (VersionUtils.hashCreateCommitGit(options)) {
                return GitUtils.createCommit(packageJsonVersion, options['git-commit-message'] ? options['git-commit-message'] : messages.GIT_COMMIT_MESSAGE, cwd);
            }

            return Promise.resolve();
        }

        /**
         * @param {string} packageJsonVersion
         * @param {VersionOptions} options
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'createTagGitIfNeeded',
        value: function createTagGitIfNeeded(packageJsonVersion, options, cwd) {
            if (VersionUtils.hashCreateTagGit(options)) {
                return GitUtils.createTag(packageJsonVersion, options['git-tag-message'] ? options['git-tag-message'] : messages.GIT_TAG_MESSAGE, cwd);
            }

            return Promise.resolve();
        }

        /**
         * Analyze the options do the bumping / versionning
         * @param {VersionOptions} [options]
         * @param {string} [cwd]
         * @returns {Promise.<string>} Will contain the updated package version
         */

    }, {
        key: 'doIt',
        value: function doIt(options, cwd) {
            if (!options || options.help) {
                // Basic: display the help message
                VersionUtils.printHelp();
            } else {
                if (VersionUtils.hasFoundPackageJsonFile(cwd)) {
                    var _ret = function () {
                        // Version manipulation !
                        var packageJson = VersionUtils.getCurrentPackageJson(cwd);
                        var packageJsonVersion = VersionUtils.getCurrentPackageJsonVersion(packageJson, cwd);

                        if (options.unpreid) {
                            // We want to only remove the prefix
                            packageJsonVersion = VersionUtils.unpreidPackageVersion(packageJsonVersion);
                        } else {
                            // We want to increment the version
                            var level = options.increment;

                            if (!level || Object.keys(LEVEL_ENUM).indexOf(level.toLowerCase()) < 0) {
                                level = LEVEL_ENUM.patch;
                            }

                            packageJsonVersion = VersionUtils.incrementPackageVersion(packageJsonVersion, level.toLowerCase(), options.preid, options['force-preid']);
                        }

                        if (options['read-only']) {
                            // Display the future version
                            VersionUtils.printVersion(packageJsonVersion);

                            // Return the updated package version
                            return {
                                v: Promise.resolve(packageJsonVersion)
                            };
                        } else {
                            // Bumping !!
                            return {
                                v: Promise.resolve().then(function () {
                                    return VersionUtils.checkForGitIfNeeded(options, cwd);
                                }).then(function () {
                                    return VersionUtils.doPrenpmVersionRunScriptIfNeeded(packageJson, cwd);
                                }).then(function () {
                                    return VersionUtils.updatePackageVersion(packageJsonVersion, cwd);
                                }).then(function () {
                                    return VersionUtils.updateJsonFilesIfNeeded(options, packageJsonVersion, cwd);
                                }).then(function () {
                                    return VersionUtils.doPostnpmVersionRunScriptIfNeeded(packageJson, cwd);
                                }).then(function () {
                                    return VersionUtils.createCommitGitIfNeeded(packageJsonVersion, options, cwd);
                                }).then(function () {
                                    return VersionUtils.createTagGitIfNeeded(packageJsonVersion, options, cwd);
                                }).then(function () {
                                    return VersionUtils.doPushGitIfNeeded(options, cwd);
                                }).then(function () {
                                    return packageJsonVersion;
                                }) // Return the updated package version
                                .catch(function (err) {
                                    if (err.name === 'GitNotInstalledError') {
                                        VersionUtils.printGitNotInstalledError();
                                    } else if (err.name === 'NotAGitProjectError') {
                                        VersionUtils.printNotAGitProjectError();
                                    } else {
                                        VersionUtils.printError(err);
                                    }

                                    return Promise.reject(err);
                                })
                            };
                        }
                    }();

                    if (typeof _ret === "object") return _ret.v;
                } else {
                    // Hummmm, are you sure we are into a NPM module folder?
                    VersionUtils.printNotFoundPackageJsonFile();
                }
            }

            return Promise.resolve();
        }

        /**
         * @param {Object} packageJson
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'doPostnpmVersionRunScriptIfNeeded',
        value: function doPostnpmVersionRunScriptIfNeeded(packageJson, cwd) {
            if (VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson(packageJson)) {
                return VersionUtils.runScriptPostnpmversion(cwd);
            }

            return Promise.resolve();
        }

        /**
         * @param {Object} packageJson
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'doPrenpmVersionRunScriptIfNeeded',
        value: function doPrenpmVersionRunScriptIfNeeded(packageJson, cwd) {
            if (VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson(packageJson)) {
                return VersionUtils.runScriptPrenpmversion(cwd);
            }

            return Promise.resolve();
        }

        /**
         * @param {VersionOptions} options
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'doPushGitIfNeeded',
        value: function doPushGitIfNeeded(options, cwd) {
            if (VersionUtils.hashPushCommitsGit(options)) {
                return GitUtils.push(VersionUtils.hashCreateTagGit(options), cwd);
            }

            return Promise.resolve();
        }

        /**
         * Get the content of the package.json file from the CWD path
         * @param {string} [cwd]
         * @returns {Object}
         */

    }, {
        key: 'getCurrentPackageJson',
        value: function getCurrentPackageJson(cwd) {
            var packageJsonContent = fs.readFileSync(path.resolve(path.join(cwd ? cwd : process.cwd(), PACKAGE_JSON_FILENAME)));
            return json5.parse(packageJsonContent);
        }

        /**
         * Get the version of the package.json file from the CWD path
         * @param {Object} [packageJson]
         * @param {string} [cwd]
         * @returns {string}
         */

    }, {
        key: 'getCurrentPackageJsonVersion',
        value: function getCurrentPackageJsonVersion(packageJson, cwd) {
            if (packageJson) {
                return packageJson.version;
            }

            return VersionUtils.getCurrentPackageJson(cwd).version;
        }

        /**
         * Checks if we found a package.json file onto the CWD path
         * @param {string} [cwd]
         * @returns {boolean}
         */

    }, {
        key: 'hasFoundPackageJsonFile',
        value: function hasFoundPackageJsonFile(cwd) {
            return fs.existsSync(path.resolve(path.join(cwd ? cwd : process.cwd(), PACKAGE_JSON_FILENAME)));
        }

        /**
         * @param {VersionOptions} [options]
         * @returns {boolean}
         */

    }, {
        key: 'hashCreateCommitGit',
        value: function hashCreateCommitGit(options) {
            return !!(!options || !options['nogit-commit']);
        }

        /**
         * @param {VersionOptions} [options]
         * @returns {boolean}
         */

    }, {
        key: 'hashCreateTagGit',
        value: function hashCreateTagGit(options) {
            return !!(!options || !options['nogit-tag']);
        }

        /**
         * @param {VersionOptions} [options]
         * @returns {boolean}
         */

    }, {
        key: 'hashPushCommitsGit',
        value: function hashPushCommitsGit(options) {
            return !!(options && options['git-push']);
        }

        /**
         * @param {VersionOptions} [options]
         * @returns {boolean}
         */

    }, {
        key: 'hasUseGit',
        value: function hasUseGit(options) {
            if (!options) {
                return false;
            }

            return VersionUtils.hashCreateCommitGit(options) || VersionUtils.hashCreateTagGit(options) || VersionUtils.hashPushCommitsGit(options);
        }

        /**
         * Remove the prefix of the package version
         * @param {string} packageVersion
         * @param {string} level
         * @param {string} [preid]
         * @param {boolean} [forceAddPreid=false]
         * @returns {string}
         *
         * Examples of classical output:
         * > semver 1.2.3 --increment patch                             1.2.4
         * > semver 1.2.3 --increment minor                             1.3.0
         * > semver 1.2.3 --increment major                             2.0.0
         * > semver 1.2.3 --increment prerelease                        1.2.4-0
         * > semver 1.2.3 --increment prepatch                          1.2.4-0
         * > semver 1.2.3 --increment preminor                          1.3.0-0
         * > semver 1.2.3 --increment premajor                          2.0.0-0
         *
         * > semver 1.2.3-0 --increment patch                           1.2.3
         * > semver 1.2.3-0 --increment minor                           1.3.0
         * > semver 1.2.3-0 --increment major                           2.0.0
         * > semver 1.2.3-0 --increment prerelease                      1.2.3-1
         * > semver 1.2.3-0 --increment prepatch                        1.2.4-0
         * > semver 1.2.3-0 --increment preminor                        1.3.0-0
         * > semver 1.2.3-0 --increment premajor                        2.0.0-0
         *
         * > semver 1.2.3-beta --increment patch                        1.2.4
         * > semver 1.2.3-beta --increment minor                        1.3.0
         * > semver 1.2.3-beta --increment major                        2.0.0
         * > semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
         * > semver 1.2.3-beta --increment prepatch                     1.2.4-0
         * > semver 1.2.3-beta --increment preminor                     1.3.0-0
         * > semver 1.2.3-beta --increment premajor                     2.0.0-0
         *
         * > semver 1.2.3-beta.0 --increment patch                      1.2.4
         * > semver 1.2.3-beta.0 --increment minor                      1.3.0
         * > semver 1.2.3-beta.0 --increment major                      2.0.0
         * > semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
         * > semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
         * > semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
         * > semver 1.2.3-beta.0 --increment premajor                   2.0.0-0
         *
         * > semver 1.2.3 --preid beta --increment patch                 1.2.4
         * > semver 1.2.3 --preid beta --increment minor                 1.3.0
         * > semver 1.2.3 --preid beta --increment major                 2.0.0
         * > semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
         * > semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
         * > semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
         * > semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0
         *
         * > semver 1.2.3-0 --preid beta --increment patch               1.2.4
         * > semver 1.2.3-0 --preid beta --increment minor               1.3.0
         * > semver 1.2.3-0 --preid beta --increment major               2.0.0
         * > semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
         * > semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
         * > semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
         * > semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0
         *
         * > semver 1.2.3-beta --preid beta --increment patch            1.2.4
         * > semver 1.2.3-beta --preid beta --increment minor            1.3.0
         * > semver 1.2.3-beta --preid beta --increment major            2.0.0
         * > semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
         * > semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
         * > semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
         * > semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0
         *
         * > semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4
         * > semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0
         * > semver 1.2.3-beta.0 --preid beta --increment major          2.0.0
         * > semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
         * > semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
         * > semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
         * > semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0
         *
         *
         *
         * With forceAddPreid to true:
         * > semver 1.2.3 --increment patch                             1.2.4
         * > semver 1.2.3 --increment minor                             1.3.0
         * > semver 1.2.3 --increment major                             2.0.0
         * > semver 1.2.3 --increment prerelease                        1.2.4-0
         * > semver 1.2.3 --increment prepatch                          1.2.4-0
         * > semver 1.2.3 --increment preminor                          1.3.0-0
         * > semver 1.2.3 --increment premajor                          2.0.0-0
         *
         * > semver 1.2.3-0 --increment patch                           1.2.3
         * > semver 1.2.3-0 --increment minor                           1.3.0
         * > semver 1.2.3-0 --increment major                           2.0.0
         * > semver 1.2.3-0 --increment prerelease                      1.2.3-1
         * > semver 1.2.3-0 --increment prepatch                        1.2.4-0
         * > semver 1.2.3-0 --increment preminor                        1.3.0-0
         * > semver 1.2.3-0 --increment premajor                        2.0.0-0
         *
         * > semver 1.2.3-beta --increment patch                        1.2.4
         * > semver 1.2.3-beta --increment minor                        1.3.0
         * > semver 1.2.3-beta --increment major                        2.0.0
         * > semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
         * > semver 1.2.3-beta --increment prepatch                     1.2.4-0
         * > semver 1.2.3-beta --increment preminor                     1.3.0-0
         * > semver 1.2.3-beta --increment premajor                     2.0.0-0
         *
         * > semver 1.2.3-beta.0 --increment patch                      1.2.4
         * > semver 1.2.3-beta.0 --increment minor                      1.3.0
         * > semver 1.2.3-beta.0 --increment major                      2.0.0
         * > semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
         * > semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
         * > semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
         * > semver 1.2.3-beta.0 --increment premajor                   2.0.0-0
         *
         * > semver 1.2.3 --preid beta --increment patch                 1.2.4-beta
         * > semver 1.2.3 --preid beta --increment minor                 1.3.0-beta
         * > semver 1.2.3 --preid beta --increment major                 2.0.0-beta
         * > semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
         * > semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
         * > semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
         * > semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0
         *
         * > semver 1.2.3-0 --preid beta --increment patch               1.2.3-beta
         * > semver 1.2.3-0 --preid beta --increment minor               1.3.0-beta
         * > semver 1.2.3-0 --preid beta --increment major               2.0.0-beta
         * > semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
         * > semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
         * > semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
         * > semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0
         *
         * > semver 1.2.3-beta --preid beta --increment patch            1.2.4-beta
         * > semver 1.2.3-beta --preid beta --increment minor            1.3.0-beta
         * > semver 1.2.3-beta --preid beta --increment major            2.0.0-beta
         * > semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
         * > semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
         * > semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
         * > semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0
         *
         * > semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4-beta
         * > semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0-beta
         * > semver 1.2.3-beta.0 --preid beta --increment major          2.0.0-beta
         * > semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
         * > semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
         * > semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
         * > semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0
         */

    }, {
        key: 'incrementPackageVersion',
        value: function incrementPackageVersion(packageVersion, level, preid, forceAddPreid) {
            if (forceAddPreid) {
                if (preid && !level.startsWith(PRE_LEVEL_SUFFIX)) {
                    var versionToUse = packageVersion;

                    if (level === LEVEL_ENUM.patch && packageVersion) {
                        var splitting = packageVersion.split(PREFIX_SEPARATOR);
                        var currentVersion = splitting[0];
                        var currentPre = splitting[1];

                        if (currentPre && !currentPre.match(NUMBER_REGEXP)) {
                            // We have a package version like 1.2.3-beta
                            versionToUse = currentVersion;
                        }
                    }

                    var version = semver.inc(versionToUse, level);
                    return '' + version + PREFIX_SEPARATOR + preid;
                }
            }

            return semver.inc(packageVersion, level, preid);
        }

        /**
         * Check if we have a "postnpmversion" as run-script into the package.json file
         * @param {Object} packageJson
         * @returns {Boolean}
         */

    }, {
        key: 'isPostnpmversionRunScriptDetectedInPackageJson',
        value: function isPostnpmversionRunScriptDetectedInPackageJson(packageJson) {
            return !!(packageJson && packageJson.scripts && packageJson.scripts.postnpmversion);
        }

        /**
         * Check if we have a "prenpmversion" as run-script into the package.json file
         * @param {Object} packageJson
         * @returns {Boolean}
         */

    }, {
        key: 'isPrenpmversionRunScriptDetectedInPackageJson',
        value: function isPrenpmversionRunScriptDetectedInPackageJson(packageJson) {
            return !!(packageJson && packageJson.scripts && packageJson.scripts.prenpmversion);
        }

        /**
         * Print the error
         */

    }, {
        key: 'printError',
        value: function printError(err) {
            console.error(err && err.stack ? err.stack : err);
            process.exit(1);
        }

        /**
         * Print the error for the exception GitNotInstalledError
         */

    }, {
        key: 'printGitNotInstalledError',
        value: function printGitNotInstalledError() {
            console.error(messages.GIT_NOT_INSTALLED);
            process.exit(1);
        }

        /**
         * Print the help text
         */

    }, {
        key: 'printHelp',
        value: function printHelp() {
            console.log(messages.HELP_TEXT, PACKAGE_JSON.version, PACKAGE_JSON.description);
        }

        /**
         * Print the error for the exception GitNotInstalledError
         */

    }, {
        key: 'printNotAGitProjectError',
        value: function printNotAGitProjectError() {
            console.error(messages.NOT_INTO_GIT_PROJECT);
            process.exit(1);
        }

        /**
         * Print that we haven't file a package.json file
         */

    }, {
        key: 'printNotFoundPackageJsonFile',
        value: function printNotFoundPackageJsonFile() {
            console.error(messages.NOT_FOUND_PACKAGE_JSON_FILE);
            process.exit(1);
        }

        /**
         * Print the nearest version
         * @param {string} packageVersion
         */

    }, {
        key: 'printVersion',
        value: function printVersion(packageVersion) {
            console.log('Nearest version: ', packageVersion);
        }

        /**
         * Run the "prenpmversion" npm scripts
         *
         * @method
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'runScriptPrenpmversion',
        value: function runScriptPrenpmversion(cwd) {
            return Utils.promisedExec('npm run prenpmversion', false, cwd);
        }

        /**
         * Run the "postnpmversion" npm scripts
         *
         * @method
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'runScriptPostnpmversion',
        value: function runScriptPostnpmversion(cwd) {
            return Utils.promisedExec('npm run postnpmversion', false, cwd);
        }

        /**
         * Remove the prefix of the package version
         * @param {string} packageVersion
         * @returns {string}
         */

    }, {
        key: 'unpreidPackageVersion',
        value: function unpreidPackageVersion(packageVersion) {
            if (packageVersion.indexOf(PREFIX_SEPARATOR) >= 0) {
                return packageVersion.split(PREFIX_SEPARATOR)[0];
            }

            return packageVersion;
        }

        /**
         * Update the package.json file and if needed the npm-shrinkwrap.json file
         * @param {string} packageVersion
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'updatePackageVersion',
        value: function updatePackageVersion(packageVersion, cwd) {
            return Utils.promisedExec('npm --no-git-tag-version version ' + packageVersion, false, cwd).then(function () {
                return packageVersion;
            });
        }

        /**
         * @param {VersionOptions} options
         * @param {string} packageVersion
         * @param {string | JsonFileEntry} jsonFilePathOrEntry
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'updateJsonFile',
        value: function updateJsonFile(options, packageVersion, jsonFilePathOrEntry, cwd) {
            var isJsonFileEntry = Utils.isJsonFileEntry(jsonFilePathOrEntry);
            var jsonFilePath = isJsonFileEntry ? jsonFilePathOrEntry.file : jsonFilePathOrEntry;
            var property = isJsonFileEntry ? jsonFilePathOrEntry.property : null;
            var filePath = path.resolve(path.join(cwd ? cwd : process.cwd(), jsonFilePath));

            return Utils.readFile(filePath).then(function (jsonContent) {
                if (property) {
                    return Utils.replaceJsonProperty(jsonContent, property, packageVersion);
                }

                return Utils.replaceJsonVersionProperty(jsonContent, packageVersion);
            }).then(function (newJsonContent) {
                return Utils.writeFile(filePath, newJsonContent);
            }).then(function () {
                if (VersionUtils.hasUseGit(options)) {
                    return GitUtils.addFile(jsonFilePath, cwd);
                }

                return Promise.resolve();
            });
        }

        /**
         * @param {VersionOptions} options
         * @param {string} packageVersion
         * @param {VersionOptions} options
         * @param {string} [cwd]
         * @returns {Promise}
         */

    }, {
        key: 'updateJsonFilesIfNeeded',
        value: function updateJsonFilesIfNeeded(options, packageVersion, cwd) {
            if (options && options.jsonFiles && options.jsonFiles.length > 0) {
                return Promise.all(options.jsonFiles.map(function (jsonFilePath) {
                    return VersionUtils.updateJsonFile(options, packageVersion, jsonFilePath, cwd);
                }));
            }

            return Promise.resolve();
        }
    }]);

    return VersionUtils;
}();

/**
 * @name ERRORS
 * @memberof VersionUtils
 */


Object.defineProperty(VersionUtils, 'ERRORS', { 'writable': false, 'value': ERRORS });

module.exports = VersionUtils;
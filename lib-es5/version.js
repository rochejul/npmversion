/**
 * Version utilities class
 *
 * @module lib/version
 * @exports VersionUtils
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
 */

// Here the class
// TODO use as much as possible unsync fs functions
module.exports = function () {
    function VersionUtils() {
        _classCallCheck(this, VersionUtils);
    }

    _createClass(VersionUtils, null, [{
        key: 'doIt',

        /**
         * Analyze the options do the bumping / versionning
         * @param {VersionOptions} [options]
         */
        value: function doIt(options) {
            if (!options || options.help) {
                // Basic: display the help message
                VersionUtils.printHelp();
            } else {
                if (VersionUtils.hasFoundPackageJsonFile()) {
                    (function () {
                        // Version manipulation !
                        var packageJsonVersion = VersionUtils.getCurrentPackageJsonVersion();

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
                        } else {
                            // Bumping !!
                            VersionUtils.updatePackageVersion(packageJsonVersion).then(function () {
                                if (!options['no-git-commit']) {
                                    return GitUtils.createCommit(packageJsonVersion);
                                }

                                return packageJsonVersion;
                            }).then(function () {
                                if (!options['no-git-tag']) {
                                    return GitUtils.createTag(packageJsonVersion);
                                }

                                return packageJsonVersion;
                            }).then(function () {
                                if (options['git-push']) {
                                    return GitUtils.push(options['no-git-tag']);
                                }

                                return packageJsonVersion;
                            }).catch(function (err) {
                                VersionUtils.printError(err);
                            });
                        }
                    })();
                } else {
                    // Hummmm, are you sure we are into a NPM module folder?
                    VersionUtils.printNotFoundPackageJsonFile();
                }
            }
        }

        /**
         * Get the version of the package.json file from the CWD path
         * @returns {string}
         */

    }, {
        key: 'getCurrentPackageJsonVersion',
        value: function getCurrentPackageJsonVersion() {
            var packageJsonContent = fs.readFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME));
            var packageJson = json5.parse(packageJsonContent);
            return packageJson.version;
        }

        /**
         * Checks if we found a package.json file onto the CWD path
         * @returns {boolean}
         */

    }, {
        key: 'hasFoundPackageJsonFile',
        value: function hasFoundPackageJsonFile() {
            return fs.existsSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME));
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
         * > semver 1.2.3-0 --preid beta --increment patch               1.2.4-beta
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
                    var version = semver.inc(packageVersion, level);
                    return '' + version + PREFIX_SEPARATOR + preid;
                }
            }

            return semver.inc(packageVersion, level, preid);
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
         * Print the help text
         */

    }, {
        key: 'printHelp',
        value: function printHelp() {
            console.log(messages.HELP_TEXT, PACKAGE_JSON.version, PACKAGE_JSON.description);
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
         * @returns {Promise}
         */

    }, {
        key: 'updatePackageVersion',
        value: function updatePackageVersion(packageVersion) {
            return Utils.promisedExec('git commit --all --message "Release version: ' + packageVersion + '"').then(function () {
                return packageVersion;
            });
        }
    }]);

    return VersionUtils;
}();
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
const path = require('path');
const fs = require('fs');

const semver = require('semver');
const json5 = require('json5');

const Utils = require('./utils');
const GitUtils = require('./git');
const messages = require('./messages');

// Constants
const PACKAGE_JSON_FILENAME = 'package.json';
const PACKAGE_JSON = require(`../${PACKAGE_JSON_FILENAME}`);

const PREFIX_SEPARATOR = '-';
const PRE_LEVEL_SUFFIX = 'pre';
const POST_LEVEL_SUFFIX = '.';

const LEVEL_ENUM = {
    'major': 'major',
    'minor': 'minor',
    'patch': 'patch',
    'premajor': 'premajor',
    'preminor': 'preminor',
    'prepatch': 'prepatch',
    'prerelease': 'prerelease'
};

const NUMBER_REGEXP = /^\d+$/;

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
module.exports = class VersionUtils {
    /**
     * Analyze the options do the bumping / versionning
     * @param {VersionOptions} [options]
     */
    static doIt(options) {
        if (!options || options.help) {
            // Basic: display the help message
            VersionUtils.printHelp();

        } else {
            if (VersionUtils.hasFoundPackageJsonFile()) {
                // Version manipulation !
                let packageJsonVersion = VersionUtils.getCurrentPackageJsonVersion();

                if (options.unpreid) {
                    // We want to only remove the prefix
                    packageJsonVersion = VersionUtils.unpreidPackageVersion(packageJsonVersion);

                } else {
                    // We want to increment the version
                    let level = options.increment;

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
                    VersionUtils
                        .updatePackageVersion(packageJsonVersion)
                        .then(function () {
                            if (!options['no-git-commit']) {
                                return GitUtils.createCommit(packageJsonVersion);
                            }

                            return packageJsonVersion;
                        })
                        .then(function () {
                            if (!options['no-git-tag']) {
                                return GitUtils.createTag(packageJsonVersion);
                            }

                            return packageJsonVersion;
                        })
                        .then(function () {
                            if (options['git-push']) {
                                return GitUtils.push(options['no-git-tag']);
                            }

                            return packageJsonVersion;
                        })
                        .catch(function (err) {
                            VersionUtils.printError(err);
                        });
                }

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
    static getCurrentPackageJsonVersion() {
        let packageJsonContent = fs.readFileSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME));
        let packageJson = json5.parse(packageJsonContent);
        return packageJson.version;
    }

    /**
     * Checks if we found a package.json file onto the CWD path
     * @returns {boolean}
     */
    static hasFoundPackageJsonFile() {
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
    static incrementPackageVersion(packageVersion, level, preid, forceAddPreid) {
        if (forceAddPreid) {
            if (preid && !level.startsWith(PRE_LEVEL_SUFFIX)) {
                let versionToUse = packageVersion;

                if (level === LEVEL_ENUM.patch && packageVersion) {
                    let splitting = packageVersion.split(PREFIX_SEPARATOR);
                    let currentVersion = splitting[0];
                    let currentPre = splitting[1];

                    if (currentPre && !currentPre.match(NUMBER_REGEXP)) {
                        // We have a package version like 1.2.3-beta
                        versionToUse = currentVersion;
                    }
                }

                let version = semver.inc(versionToUse, level);
                return `${version}${PREFIX_SEPARATOR}${preid}`;
            }
        }

        return semver.inc(packageVersion, level, preid);
    }

    /**
     * Print the error
     */
    static printError(err) {
        console.error(err && err.stack ? err.stack : err);
        process.exit(1);
    }

    /**
     * Print the help text
     */
    static printHelp() {
        console.log(messages.HELP_TEXT, PACKAGE_JSON.version, PACKAGE_JSON.description);
    }

    /**
     * Print that we haven't file a package.json file
     */
    static printNotFoundPackageJsonFile() {
        console.error(messages.NOT_FOUND_PACKAGE_JSON_FILE);
        process.exit(1);
    }

    /**
     * Print the nearest version
     * @param {string} packageVersion
     */
    static printVersion(packageVersion) {
        console.log('Nearest version: ', packageVersion);
    }

    /**
     * Remove the prefix of the package version
     * @param {string} packageVersion
     * @returns {string}
     */
    static unpreidPackageVersion(packageVersion) {
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
    static updatePackageVersion(packageVersion) {
        return Utils
            .promisedExec(`git commit --all --message "Release version: ${packageVersion}"`)
            .then(function () {
                return packageVersion;
            });
    }
};

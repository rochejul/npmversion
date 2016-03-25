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
const messages = require('./messages');

// Constants
const PACKAGE_JSON_FILENAME = 'package.json';
const PACKAGE_JSON = require(`../${PACKAGE_JSON_FILENAME}`);
const PREFIX_SEPARATOR = '-';
const PRE_LEVEL_SUFFIX = 'pre';
const LEVEL_ENUM = {
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
 * @property {boolean} [read-only=false]
 * @property {boolean} [no-git-commit=false]
 * @property {boolean} [no-git-tag=false]
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

                    packageJsonVersion = VersionUtils.incrementPackageVersion(packageJsonVersion, level.toLowerCase(), options.preid);
                }

                if (options['read-only']) {
                    // Display the future version
                    VersionUtils.printVersion(packageJsonVersion);

                } else {
                    // Bumping !!
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
     * @returns {string}
     */
    static incrementPackageVersion(packageVersion, level, preid) {
        let cleanedVersion = VersionUtils.unpreidPackageVersion(packageVersion);

        if (preid && !level.startsWith(PRE_LEVEL_SUFFIX)) {
            let version = semver.inc(cleanedVersion, level);
            return `${version}${PREFIX_SEPARATOR}${preid}`;
        }

        return semver.inc(cleanedVersion, level, preid);
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
        return Utils.promisedExec(`git commit --all --message "Release version: ${packageVersion}"`);
    }
};

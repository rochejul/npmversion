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
const messages = require('./messages');

// Constants
const PACKAGE_JSON_FILENAME = 'package.json';
const PACKAGE_JSON = require(`../${PACKAGE_JSON_FILENAME}`);

// Class documentation

/**
 * @class VersionOptions
 * @property {boolean} [help=false]
 * @property {boolean} [unpreid=false]
 * @property {boolean} [read-only=false]
 * @property {boolean} [no-git-commit=false]
 * @property {boolean} [no-git-tag=false]
 * @property {string} [increment='patch']
 * @property {string} [preid='snapshot']
 */

// Here the class
module.exports = class VersionUtils {
    /**
     * Checks if we found a package.json file onto the current folder
     * @returns {boolean}
     */
    static hasFoundPackageJsonFile() {
        return fs.existsSync(path.join(process.cwd(), PACKAGE_JSON_FILENAME));
    }

    /**
     * Analyze the options do the bumping / versionning
     * @param {VersionOptions} [options]
     */
    static doIt(options) {
        if (!options || options.help) {
            VersionUtils.printHelp();

        } else {
            if (VersionUtils.hasFoundPackageJsonFile()) {

            } else {
                VersionUtils.printNotFoundPackageJsonFile();
            }
        }
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
};

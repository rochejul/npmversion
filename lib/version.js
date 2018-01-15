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

const ERRORS = Object.freeze({
    'GitNotInstalledError': class GitNotInstalledError extends Error {
        constructor() {
            super('Git seems not be to be installed');
            this.name = 'GitNotInstalledError';
        }
    },
    'NotAGitProjectError': class NotAGitProjectError extends Error {
        constructor() {
            super('It seems there is not initialized git project');
            this.name = 'NotAGitProjectError';
        }
    }
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
 * @property {boolean} [git-create-branch=false]
 * @property {string} [increment=LEVEL_ENUM.patch]
 * @property {string} [preid]
 * @property {string} [git-remote-name]
 * @property {string} [git-branch-message]
 * @property {string} [git-commit-message]
 * @property {string} [git-tag-message]
 * @property {boolean} [ignoreErrorJsonFile=false]
 * @property {string[]} [jsonFiles] Relative paths from the package.json to update files with a "version" property
 */

// Here the class
class VersionUtils {
    /**
     * @param {VersionOptions} options
     * @param {string} [cwd]
     * @returns {Promise.<void | GitNotInstalledError | NotAGitProjectError>}
     */
    static checkForGitIfNeeded(options, cwd) {
        if (VersionUtils.hasUseGit(options)) {
            return GitUtils
                .hasGitInstalled()
                .then(state => {
                    if (!state) {
                        return Promise.reject(new ERRORS.GitNotInstalledError());
                    }

                    return GitUtils.hasGitProject(cwd);
                })
                .then(state => {
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
    static createBranchGitIfNeeded(packageJsonVersion, options, cwd) {
        if (VersionUtils.hashCreateBranchGit(options)) {
            return GitUtils.createBranch(packageJsonVersion, options['git-branch-message'] ? options['git-branch-message'] : messages.GIT_BRANCH_MESSAGE, cwd);
        }

        return Promise.resolve();
    }

    /**
     * @param {string} packageJsonVersion
     * @param {VersionOptions} options
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static createCommitGitIfNeeded(packageJsonVersion, options, cwd) {
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
    static createTagGitIfNeeded(packageJsonVersion, options, cwd) {
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
    static doIt(options, cwd) {
        if (!options || options.help) {
            // Basic: display the help message
            VersionUtils.printHelp();

        } else {
            if (VersionUtils.hasFoundPackageJsonFile(cwd)) {
                // Version manipulation !
                let packageJson = VersionUtils.getCurrentPackageJson(cwd);
                let packageJsonVersion = VersionUtils.getCurrentPackageJsonVersion(packageJson, cwd);

                if (options.unpreid) {
                    // We want to only remove the prefix
                    packageJsonVersion = VersionUtils.unpreidPackageVersion(packageJsonVersion);

                } else {
                    // We want to increment the version
                    packageJsonVersion = VersionUtils.incrementPackageVersion(
                        packageJsonVersion,
                        VersionUtils.getIncrementationLevel(options),
                        options.preid,
                        options['force-preid']
                    );
                }

                if (options['read-only']) {
                    // Display the future version
                    VersionUtils.printVersion(packageJsonVersion);

                    // Return the updated package version
                    return Promise.resolve(packageJsonVersion);

                } else {
                    // Bumping !!
                    return Promise
                        .resolve()
                        .then(() => VersionUtils.checkForGitIfNeeded(options, cwd))
                        .then(() => VersionUtils.doPrenpmVersionRunScriptIfNeeded(packageJson, cwd))
                        .then(() => VersionUtils.updatePackageVersion(packageJsonVersion, cwd))
                        .then(() => VersionUtils.updateJsonFilesIfNeeded(options, packageJsonVersion, cwd))
                        .then(() => VersionUtils.doPostnpmVersionRunScriptIfNeeded(packageJson, cwd))
                        .then(() => VersionUtils.createCommitGitIfNeeded(packageJsonVersion, options, cwd))
                        .then(() => VersionUtils.createBranchGitIfNeeded(packageJsonVersion, options, cwd))
                        .then(() => VersionUtils.createTagGitIfNeeded(packageJsonVersion, options, cwd))
                        .then(() => VersionUtils.doPushGitIfNeeded(options, cwd))
                        .then(() => packageJsonVersion) // Return the updated package version
                        .catch((err) => {
                            if (err.name === 'GitNotInstalledError') {
                                VersionUtils.printGitNotInstalledError();

                            } else if (err.name === 'NotAGitProjectError') {
                                VersionUtils.printNotAGitProjectError();

                            } else if (err.name === 'NoRemoteGitError') {
                                VersionUtils.printNoRemoteGitError();

                            } else if (err.name === 'MultipleRemoteError') {
                                VersionUtils.printMultipleRemoteError();

                            } else {
                                VersionUtils.printError(err);
                            }

                            return Promise.reject(err);
                        });
                }

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
    static doPostnpmVersionRunScriptIfNeeded(packageJson, cwd) {
        if (VersionUtils.isPostnpmversionRunScriptDetectedInPackageJson(packageJson) && !VersionUtils.isNpmversionRunScriptDetectedInPackageJson(packageJson)) { // if "npmversion" is into the run scripts, npm will automatically dears with the pre / post (if the command is run with "nom run npmversion")
            return VersionUtils.runScriptPostnpmversion(cwd);
        }

        return Promise.resolve();
    }

    /**
     * @param {Object} packageJson
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static doPrenpmVersionRunScriptIfNeeded(packageJson, cwd) {
        if (VersionUtils.isPrenpmversionRunScriptDetectedInPackageJson(packageJson) && !VersionUtils.isNpmversionRunScriptDetectedInPackageJson(packageJson)) {  // if "npmversion" is into the run scripts, npm will automatically dears with the pre / post (if the command is run with "nom run npmversion")
            return VersionUtils.runScriptPrenpmversion(cwd);
        }

        return Promise.resolve();
    }

    /**
     * @param {VersionOptions} options
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static doPushGitIfNeeded(options, cwd) {
        if (VersionUtils.hashPushCommitsGit(options)) {
            let remoteOriginName = VersionUtils.hasRemoteNameGit(options) ? options['git-remote-name'] : GitUtils.getRemoteName(cwd);

            return GitUtils
                .isCurrentBranchUpstream(cwd)
                .then(isUpstream => {
                    if (!isUpstream) {
                        return Promise
                            .all([
                                remoteOriginName,
                                GitUtils.getBranchName(cwd)
                            ])
                            .then(results => {
                                let remoteName = results[0];
                                let branchName = results[1];

                                return GitUtils.upstreamBranch(remoteName, branchName, cwd);
                            });
                    }

                    return Promise.resolve();
                })
                .then(() => GitUtils.push(VersionUtils.hashCreateTagGit(options), cwd));
        }

        return Promise.resolve();
    }

    /**
     * Get the content of the package.json file from the CWD path
     * @param {string} [cwd]
     * @returns {Object}
     */
    static getCurrentPackageJson(cwd) {
        let packageJsonContent = fs.readFileSync(path.resolve(path.join(cwd ? cwd : process.cwd(), PACKAGE_JSON_FILENAME)));
        return json5.parse(packageJsonContent);
    }

    /**
     * Get the version of the package.json file from the CWD path
     * @param {Object} [packageJson]
     * @param {string} [cwd]
     * @returns {string}
     */
    static getCurrentPackageJsonVersion(packageJson, cwd) {
        if (packageJson) {
            return packageJson.version;
        }

        return VersionUtils.getCurrentPackageJson(cwd).version;
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {string}
     */
    static getIncrementationLevel(options) {
        let level = options ? options.increment : null;

        if (!level || Object.keys(LEVEL_ENUM).indexOf(level.toLowerCase()) < 0) {
            level = LEVEL_ENUM.patch;
        }

        return level.toLowerCase();
    }

    /**
     * Checks if we found a package.json file onto the CWD path
     * @param {string} [cwd]
     * @returns {boolean}
     */
    static hasFoundPackageJsonFile(cwd) {
        return fs.existsSync(path.resolve(path.join(cwd ? cwd : process.cwd(), PACKAGE_JSON_FILENAME)));
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {boolean}
     */
    static hashCreateBranchGit(options) {
        return !!(options && options['git-create-branch']);
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {boolean}
     */
    static hashCreateCommitGit(options) {
        return !!(!options || !options['nogit-commit']);
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {boolean}
     */
    static hashCreateTagGit(options) {
        return !!(!options || !options['nogit-tag']);
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {boolean}
     */
    static hasIgnoreErrorJsonFile(options) {
        return !!(options && options.ignoreErrorJsonFile);
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {boolean}
     */
    static hashPushCommitsGit(options) {
        return !!(options && options['git-push']);
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {boolean}
     */
    static hasRemoteNameGit(options) {
        return !!(options && options['git-remote-name']);
    }

    /**
     * @param {VersionOptions} [options]
     * @returns {boolean}
     */
    static hasUseGit(options) {
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
     * Check if we have a "npmversion" as run-script into the package.json file
     * @param {Object} packageJson
     * @returns {Boolean}
     */
    static isNpmversionRunScriptDetectedInPackageJson(packageJson) {
        return !!(packageJson && packageJson.scripts && packageJson.scripts.npmversion);
    }

    /**
     * Check if we have a "postnpmversion" as run-script into the package.json file
     * @param {Object} packageJson
     * @returns {Boolean}
     */
    static isPostnpmversionRunScriptDetectedInPackageJson(packageJson) {
        return !!(packageJson && packageJson.scripts && packageJson.scripts.postnpmversion);
    }

    /**
     * @param {string} level
     * @return {boolean}
     */
    static isPreidLevel(level) {
        return !!(level && level.toLowerCase().startsWith(PRE_LEVEL_SUFFIX));
    }

    /**
     * Check if we have a "prenpmversion" as run-script into the package.json file
     * @param {Object} packageJson
     * @returns {Boolean}
     */
    static isPrenpmversionRunScriptDetectedInPackageJson(packageJson) {
        return !!(packageJson && packageJson.scripts && packageJson.scripts.prenpmversion);
    }

    /**
     * Print the error
     */
    static printError(err) {
        console.error(err && err.stack ? err.stack : err);
        process.exit(1);
    }

    /**
     * Print the error for the exception GitNotInstalledError
     */
    static printGitNotInstalledError() {
        console.error(messages.GIT_NOT_INSTALLED);
        process.exit(1);
    }

    /**
     * Print the help text
     */
    static printHelp() {
        console.log(messages.HELP_TEXT, PACKAGE_JSON.version, PACKAGE_JSON.description);
    }

    /**
     * Print that we have an ignored json file
     */
    static printIgnoredJsonFile(jsonFilePath) {
        console.warn(messages.IGNORED_JSON_FILE, jsonFilePath);
    }

    /**
     * Print the error for the exception GitNotInstalledError
     */
    static printNotAGitProjectError() {
        console.error(messages.NOT_INTO_GIT_PROJECT);
        process.exit(1);
    }

    /**
     * Print that we haven't file a package.json file
     */
    static printNotFoundPackageJsonFile() {
        console.error(messages.NOT_FOUND_PACKAGE_JSON_FILE);
        process.exit(1);
    }

    static printNoRemoteGitError() {
        console.error(messages.NO_REMOTE_GIT);
        process.exit(1);
    }

    static printMultipleRemoteError() {
        console.error(messages.MULTIPLE_REMOTE_GIT);
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
     * Run the "prenpmversion" npm scripts
     *
     * @method
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static runScriptPrenpmversion(cwd) {
        return Utils
            .promisedExec('npm run prenpmversion', false, cwd);
    }

    /**
     * Run the "postnpmversion" npm scripts
     *
     * @method
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static runScriptPostnpmversion(cwd) {
        return Utils
            .promisedExec('npm run postnpmversion', false, cwd);
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
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static updatePackageVersion(packageVersion, cwd) {
        return Utils
            .promisedSpawn('npm', ['--no-git-tag-version', 'version', packageVersion], false, cwd)
            .then(function () {
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
    static updateJsonFile(options, packageVersion, jsonFilePathOrEntry, cwd) {
        let isJsonFileEntry = Utils.isJsonFileEntry(jsonFilePathOrEntry);
        let jsonFilePath = isJsonFileEntry ? jsonFilePathOrEntry.file : jsonFilePathOrEntry;
        let property = isJsonFileEntry ? jsonFilePathOrEntry.property : null;
        let filePath = path.resolve(path.join(cwd ? cwd : process.cwd(), jsonFilePath));

        return Utils
            .readFile(filePath)
            .then(jsonContent => {
                if (property) {
                    return Utils.replaceJsonProperty(jsonContent, property, packageVersion);
                }

                return Utils.replaceJsonVersionProperty(jsonContent, packageVersion);
            })
            .then(newJsonContent => Utils.writeFile(filePath, newJsonContent))
            .then(() => {
                if (VersionUtils.hasUseGit(options)) {
                    return GitUtils.addFile(jsonFilePath, cwd);
                }

                return Promise.resolve();
            })
            .catch(err => {
                if (VersionUtils.hasIgnoreErrorJsonFile(options)) {
                    VersionUtils.printIgnoredJsonFile(jsonFilePath);
                    return Promise.resolve();
                }

                return Promise.reject(err);
            });
    }

    /**
     * @param {VersionOptions} options
     * @param {string} packageVersion
     * @param {VersionOptions} options
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static updateJsonFilesIfNeeded(options, packageVersion, cwd) {
        if (options && options.jsonFiles && options.jsonFiles.length > 0) {
            return Promise.all(
                options.jsonFiles.map(jsonFilePath => VersionUtils.updateJsonFile(options, packageVersion, jsonFilePath, cwd))
            );
        }

        return Promise.resolve();
    }
}

/**
 * @name ERRORS
 * @memberof VersionUtils
 */
Object.defineProperty(VersionUtils, 'ERRORS', { 'writable': false, 'value': ERRORS });

module.exports = VersionUtils;

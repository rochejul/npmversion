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
const Utils = require('./utils');

// Constants
const ESCAPE_DOUBLE_QUOTE = '\\"';
const REGEX = {
    'PURCENTAGE_STRING': /%s/g,
    'DOUBLE_QUOTE': /"/g
};

// Here the class
module.exports = class GitUtils {
    /**
     * @param {string} filePath
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static addFile(filePath, cwd) {
        return Utils.promisedExec(`git add ${filePath}`, false, cwd);
    }

    /**
     * Create a commit git
     * @param {string} packageVersion
     * @param {string} [label]
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static createCommit(packageVersion, label, cwd) {
        return Utils.promisedExec(`git commit --all --message "${GitUtils.createCommitLabel(packageVersion, label)}"`, false, cwd);
    }

    /**
     * Generate the commit description
     * @param {string} packageVersion
     * @param {string} [label]
     * @returns {string}
     */
    static createCommitLabel(packageVersion, label) {
        if (label) {
            return label
                .replace(REGEX.PURCENTAGE_STRING, packageVersion)
                .replace(REGEX.DOUBLE_QUOTE, ESCAPE_DOUBLE_QUOTE);
        }

        return `Release version: ${packageVersion}`;
    }

    /**
     * Create a tag git
     * @param {string} packageVersion
     * @param {string} [label]
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static createTag(packageVersion, label, cwd) {
        return Utils.promisedExec(`git tag "${GitUtils.createTagLabel(packageVersion, label)}"`, false, cwd);
    }

    /**
     * Generate the tag description
     * @param {string} packageVersion
     * @param {string} [label]
     * @returns {string}
     */
    static createTagLabel(packageVersion, label) {
        if (label) {
            return label
                .replace(REGEX.PURCENTAGE_STRING, packageVersion)
                .replace(REGEX.DOUBLE_QUOTE, ESCAPE_DOUBLE_QUOTE);
        }

        return `v${packageVersion}`;
    }

    /**
     * @returns {Promise.<boolean>}
     */
    static hasGitInstalled() {
        return Utils
            .promisedExec('git --help', true)
            .then(() => true)
            .catch(() => false);
    }

    /**
     * @param {string} [cwd]
     * @returns {Promise.<boolean>}
     */
    static hasGitProject(cwd) {
        return Utils
            .promisedExec('git status --porcelain', true, cwd)
            .then(() => true)
            .catch(() => false);
    }

    /**
     * @param {string} [cwd]
     * @returns {Promise.<string>}
     */
    static getBranchName(cwd) {
        return Utils
            .promisedExec('git rev-parse --abbrev-ref HEAD', true, cwd);
    }

    /**
     * @param {string} [cwd]
     * @returns {Promise.<string>}
     */
    static getRemoteName(cwd) {
        return Utils
            .promisedExec('git origin', true, cwd);
    }

    /**
     * Push the commits and the tags if needed
     * @param {boolean} [tags=false]
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static push(tags, cwd) {
        return Utils.promisedExec(`git push${tags ? ' && git push --tags' : ''}`, false, cwd);
    }

    /**
     * Push the current branch if needed
     * @param {string} [cwd]
     * @returns {Promise}
     */
    static upstreamCurrentBranch(cwd) {
        return Promise
            .all([
                GitUtils.getRemoteName(cwd),
                GitUtils.getBranchName(cwd)
            ])
            .then(infos => {
                let remoteName = infos[0];
                let branchName = infos[1];

                return Utils.promisedExec(`git push --set-upstream ${remoteName} ${branchName}`, false, cwd);
            });
    }
};

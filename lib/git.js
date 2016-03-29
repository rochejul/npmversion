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
     * Create a commit git
     * @param {string} packageVersion
     * @param {string} [label]
     * @returns {Promise}
     */
    static createCommit(packageVersion, label) {
        return Utils.promisedExec(`git commit --all --message "${GitUtils.createCommitLabel(packageVersion, label)}"`);
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
     * @returns {Promise}
     */
    static createTag(packageVersion, label) {
        return Utils.promisedExec(`git tag "${GitUtils.createTagLabel(packageVersion, label)}"`);
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
     * Push the commits and the tags if needed
     * @param {boolean} [tags=false]
     * @returns {Promise}
     */
    static push(tags) {
        return Utils.promisedExec(`git push${tags ? ' && git push --tags' : ''}`);
    }
};

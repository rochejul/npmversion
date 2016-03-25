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

// Here the class
module.exports = class GitUtils {
    /**
     * Create a commit git
     * @param {string} packageVersion
     * @returns {Promise}
     */
    static createCommit(packageVersion) {
        return Utils.promisedExec(`git commit --all --message "Release version: ${packageVersion}"`);
    }

    /**
     * Create a tag git
     * @param {string} packageVersion
     * @returns {Promise}
     */
    static createCommit(packageVersion) {
        return Utils.promisedExec(`git tag "v${packageVersion}"`);
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

/**
 * RC file loaderparameters analyzer
 *
 * @module lib/rc
 * @exports rcOptionsRetriever
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports
const rc = require('rc');
const PACKAGE_JSON = require('../package.json');

// Constants
const RC_OPTIONS = {
    'force-preid': false,
    'nogit-commit': false,
    'nogit-tag': false,
    'git-push': false,
    'increment': 'patch'
};

/**
 * @name rcOptionsRetriever
 * @returns {VersionOptions}
 */
module.exports = function () {
    let appCfg = rc(PACKAGE_JSON.name, RC_OPTIONS, []);

    delete appCfg.config;
    delete appCfg.configs;

    return appCfg;
};

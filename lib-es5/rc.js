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

var rc = require('rc');

var PACKAGE_JSON = require('../package.json');
var messages = require('./messages');

// Constants
var RC_OPTIONS = {
    'force-preid': false,
    'nogit-commit': false,
    'nogit-tag': false,
    'git-push': false,
    'git-commit-message': messages.GIT_COMMIT_MESSAGE,
    'git-tag-message': messages.GIT_TAG_MESSAGE,
    'increment': 'patch'
};

/**
 * @name rcOptionsRetriever
 * @returns {VersionOptions}
 */
module.exports = function () {
    var appCfg = rc(PACKAGE_JSON.name, RC_OPTIONS, []);

    delete appCfg.config;
    delete appCfg.configs;

    return appCfg;
};
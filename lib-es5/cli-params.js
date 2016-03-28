/**
 * Cli parameters analyzer
 *
 * @module lib/cli-params
 * @exports versionOptionsAnalyzer
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports

var minimist = require('minimist');
var _ = require('lodash');

// Constants
var MINIMIST_OPTIONS = {
    'boolean': ['help', 'unpreid', 'force-preid', 'read-only', 'nogit-commit', 'nogit-tag', 'git-push'],
    'string': ['increment', 'preid'],
    'alias': {
        'i': 'increment',
        'p': 'preid',
        'u': 'unpreid'
    },
    'default': {
        'help': false,
        'unpreid': false,
        'read-only': false,
        'force-preid': false,
        'nogit-commit': false,
        'nogit-tag': false,
        'git-push': false,
        'increment': 'patch',
        'preid': null
    },
    'stopEarly': true
};

/**
 * @name versionOptionsAnalyzer
 * @param {string[]} cliParameters
 * @param {Object} [defaultOptions]
 * @returns {versionOptions}
 */
module.exports = function (cliParameters, defaultOptions) {
    var options = MINIMIST_OPTIONS;

    if (defaultOptions) {
        options = _.merge({}, MINIMIST_OPTIONS, { 'default': defaultOptions });
    }

    return minimist(cliParameters, options);
};
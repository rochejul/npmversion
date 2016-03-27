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
const minimist = require('minimist');

// Constants
const MINIMIST_OPTIONS = {
    'boolean': ['help', 'unpreid', 'force-preid', 'read-only', 'no-git-commit', 'no-git-tag', 'git-push'],
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
        'no-git-commit': false,
        'no-git-tag': false,
        'git-push': false,
        'increment': 'patch',
        'preid': null
    },
    'stopEarly': true
};

/**
 * @name versionOptionsAnalyzer
 * @param {string[]} cliParameters
 * @returns {versionOptions}
 */
module.exports = function (cliParameters) {
    return minimist(cliParameters, MINIMIST_OPTIONS);
};

/**
 * Entry point of the node module
 *
 * @module lib/index
 * @exports NodeVersion
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports
const minimist = require('minimist');
const VersionUtils = require('./version');

// Constants
const MINIMIST = {
    'boolean': ['help', 'unpreid', 'read-only', 'no-git-commit', 'no-git-tag'],
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
        'no-git-commit': false,
        'no-git-tag': false,
        'increment': 'patch',
        'preid': null
    },
    'stopEarly': true
};

// Do it !
VersionUtils.doIt(
    minimist(process.argv.slice(2), MINIMIST)
);


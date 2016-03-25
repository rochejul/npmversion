/**
 * CLI entry point
 *
 * @module lib/cli
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports
const versionOptionsAnalyzer = require('./cli-params');
const VersionUtils = require('./version');

// Do it !
VersionUtils.doIt(
    versionOptionsAnalyzer(process.argv.slice(2))
);


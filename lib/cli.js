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
const Utils = require('./utils');
const VersionUtils = require('./version');

// Do it !
let argv = process.argv.slice(2);

VersionUtils.doIt(
  argv && argv.length > 0 ? Utils.paramsLoader(argv) : null,
  process.cwd(),
);

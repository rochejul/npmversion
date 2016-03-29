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

// Constants
var RC_OPTIONS = {
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
  var appCfg = rc(PACKAGE_JSON.name, RC_OPTIONS, []);

  delete appCfg.config;
  delete appCfg.configs;

  return appCfg;
};
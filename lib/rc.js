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
const messages = require('./messages');

// Constants
const RC_OPTIONS = {
  'force-preid': false,
  'nogit-commit': false,
  'nogit-tag': false,
  'git-push': false,
  'git-create-branch': false,
  'git-commit-message': messages.GIT_COMMIT_MESSAGE,
  'git-branch-message': messages.GIT_BRANCH_MESSAGE,
  'git-tag-message': messages.GIT_TAG_MESSAGE,
  'git-remote-name': null,
  increment: 'patch',
  ignoreErrorJsonFile: false,
  jsonFiles: [],
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

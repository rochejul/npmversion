/**
 * Load all possible messages
 *
 * @module lib/messages
 * @exports object
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports

var path = require('path');
var fs = require('fs');

// Here the messages mapping
module.exports = {
  'GIT_COMMIT_MESSAGE': 'Release version: %s',
  'GIT_TAG_MESSAGE': 'v%s',
  'HELP_TEXT': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/help.txt'))).toString(),
  'NOT_FOUND_PACKAGE_JSON_FILE': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/not-found-package-json-file.txt'))).toString()
};
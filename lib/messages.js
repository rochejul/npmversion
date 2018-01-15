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
const path = require('path');
const fs = require('fs');

// Here the messages mapping
module.exports = {
    'GIT_COMMIT_MESSAGE': 'Release version: %s',
    'GIT_BRANCH_MESSAGE': 'release/%s',
    'GIT_TAG_MESSAGE': 'v%s',
    'HELP_TEXT': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/help.txt'))).toString(),
    'IGNORED_JSON_FILE': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/ignored-json-file.txt'))).toString(),
    'NOT_FOUND_PACKAGE_JSON_FILE': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/not-found-package-json-file.txt'))).toString(),
    'NO_REMOTE_GIT': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/no-remote-git.txt'))).toString(),
    'MULTIPLE_REMOTE_GIT': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/multiple-remote-git.txt'))).toString(),
    'GIT_NOT_INSTALLED': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/git-not-installed.txt'))).toString(),
    'NOT_INTO_GIT_PROJECT': fs.readFileSync(path.resolve(path.join(__dirname, '../resources/not-into-git-project.txt'))).toString()
};

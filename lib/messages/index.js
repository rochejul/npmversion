/**
 * Load all possible messages
 *
 * @module lib//messages
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
    'HELP_TEXT': fs.readFileSync(path.resolve(path.join(__dirname, './help.txt'))).toString(),
    'NOT_FOUND_PACKAGE_JSON_FILE': fs.readFileSync(path.resolve(path.join(__dirname, './not-found-package-json-file.txt'))).toString()
};
/**
 * Utilities class
 *
 * @module lib/utils
 * @exports Utils
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var childProcess = require('child_process');
var _ = require('lodash');

var versionOptionsAnalyzer = require('./cli-params');
var rcOptionsRetriever = require('./rc');

/**
 * @class JsonFileEntry
 * @property {string} file
 * @property {string} property
 */

// Constants & variables
// Here the class

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'isJsonFileEntry',

        /**
         * @param {Object | JsonFileEntry} object
         * @returns {boolean}
         */
        value: function isJsonFileEntry(object) {
            return !!(object && object.file && object.property);
        }

        /**
         * Load the application parameters
         * @param {string[]} cliParams
         * @return {VersionOptions}
         */

    }, {
        key: 'paramsLoader',
        value: function paramsLoader(cliParams) {
            var baseOptions = rcOptionsRetriever();
            return versionOptionsAnalyzer(cliParams, baseOptions);
        }

        /**
         * @param {string} command
         * @param {boolean} [silent=false]
         * @param {string} [cwd]
         * @returns {Promise.<string>}
         */

    }, {
        key: 'promisedExec',
        value: function promisedExec(command, silent, cwd) {
            return new Promise(function (resolve, reject) {
                var instance = childProcess.exec(command, { 'cwd': cwd ? cwd : process.cwd() }, function (error, stdout) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(stdout);
                    }
                });

                if (!silent) {
                    instance.stdout.on('data', function (data) {
                        console.log(data);
                    });

                    instance.stderr.on('data', function (data) {
                        console.error(data);
                    });
                }
            });
        }

        /**
         * @param {string} filePath
         * @returns {Promise}
         */

    }, {
        key: 'readFile',
        value: function readFile(filePath) {
            return new Promise(function (resolve, reject) {
                fs.readFile(filePath, function (err, content) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(content.toString());
                    }
                });
            });
        }

        /**
         * @param {string} content
         * @param {string} propertyName
         * @param {string} value
         * @returns {string}
         */

    }, {
        key: 'replaceJsonProperty',
        value: function replaceJsonProperty(content, propertyName, value) {
            var propertyToFound = '"' + propertyName + '"';
            var indexPropertyToFound = content.indexOf(propertyToFound);

            if (indexPropertyToFound >= 0) {
                var startIndex = content.indexOf('"', indexPropertyToFound + propertyToFound.length);
                var startExtract = content.substr(0, startIndex + 1);
                var endExtract = content.substr(startIndex + 1);
                endExtract = endExtract.substr(endExtract.indexOf('"'));

                return '' + startExtract + value + endExtract;
            }

            return content;
        }

        /**
         * @param {string} content
         * @param {string} value
         * @returns {string}
         */

    }, {
        key: 'replaceJsonVersionProperty',
        value: function replaceJsonVersionProperty(content, value) {
            return Utils.replaceJsonProperty(content, 'version', value);
        }

        /**
         * @param {string} str
         * @returns {string[]}
         */

    }, {
        key: 'splitByEndOfLine',
        value: function splitByEndOfLine(str) {
            return str ? _.compact(str.replace('\r', '').split('\n')) : [];
        }

        /**
         * @param {string} filePath
         * @returns {Promise}
         */

    }, {
        key: 'writeFile',
        value: function writeFile(filePath, content) {
            return new Promise(function (resolve, reject) {
                fs.writeFile(filePath, content, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }]);

    return Utils;
}();

module.exports = Utils;
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
const fs = require('fs');
const childProcess = require('child_process');

const versionOptionsAnalyzer = require('./cli-params');
const rcOptionsRetriever = require('./rc');

/**
 * @class JsonFileEntry
 * @property {string} file
 * @property {string} property
 */

// Constants & variables
// Here the class
class Utils {
    /**
     * @param {Object | JsonFileEntry} object
     * @returns {boolean}
     */
    static isJsonFileEntry(object) {
        return !!(object && object.file && object.property);
    }

    /**
     * Load the application parameters
     * @param {string[]} cliParams
     * @return {VersionOptions}
     */
    static paramsLoader(cliParams) {
        let baseOptions = rcOptionsRetriever();
        return versionOptionsAnalyzer(cliParams, baseOptions);
    }

    /**
     * @param {string} command
     * @param {boolean} [silent=false]
     * @param {string} [cwd]
     * @returns {Promise.<string>}
     */
    static promisedExec(command, silent, cwd) {
        return new Promise(function (resolve, reject) {
            let instance = childProcess.exec(command, { 'cwd': cwd ? cwd : process.cwd() }, (error, stdout) => {
                if (error) {
                    reject(error);

                } else {
                    resolve(stdout);
                }
            });

            if (!silent) {
                instance.stdout.on('data', function(data) {
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
    static readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, content) => {
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
    static replaceJsonProperty(content, propertyName, value) {
        let propertyToFound = `"${propertyName}"`;
        let indexPropertyToFound = content.indexOf(propertyToFound);

        if (indexPropertyToFound >= 0) {
            let startIndex = content.indexOf('"', indexPropertyToFound + propertyToFound.length);
            let startExtract = content.substr(0, startIndex + 1);
            let endExtract = content.substr(startIndex + 1);
            endExtract = endExtract.substr(endExtract.indexOf('"'));

            return `${startExtract}${value}${endExtract}`;
        }

        return content;
    }

    /**
     * @param {string} content
     * @param {string} value
     * @returns {string}
     */
    static replaceJsonVersionProperty(content, value) {
        return Utils.replaceJsonProperty(content, 'version', value);
    }

    /**
     * @param {string} str
     * @returns {string[]}
     */
    static splitByEndOfLine(str) {
        return str ? str.replace('\r', '').split('\n') : [];
    }

    /**
     * @param {string} filePath
     * @returns {Promise}
     */
    static writeFile(filePath, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, (err) => {
                if (err) {
                    reject(err);

                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Utils;

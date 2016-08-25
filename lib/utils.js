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
const exec = require('child_process').exec;

const versionOptionsAnalyzer = require('./cli-params');
const rcOptionsRetriever = require('./rc');


// Here the class
module.exports = class Utils {
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
     * @returns {Promise}
     */
    static promisedExec(command) {
        return new Promise(function (resolve, reject) {
            let instance = exec(command, (error) => {
                if (error) {
                    reject(error);

                } else {
                    resolve();
                }
            });

            instance.stdout.on('data', function(data) {
                console.log(data);
            });

            instance.stderr.on('data', function (data) {
                console.error(data);
            });
        });
    }
};

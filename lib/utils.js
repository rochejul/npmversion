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


// Here the class
module.exports = class Utils {
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

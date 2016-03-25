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

var exec = require('child_process').exec;

// Here the class
module.exports = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'promisedExec',

        /**
         * @param {string} command
         * @returns {Promise}
         */
        value: function promisedExec(command) {
            return new Promise(function (resolve, reject) {
                var instance = exec(command, function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                instance.stdout.on('data', function (data) {
                    console.log(data);
                });

                instance.stderr.on('data', function (data) {
                    console.error(data);
                });
            });
        }
    }]);

    return Utils;
}();
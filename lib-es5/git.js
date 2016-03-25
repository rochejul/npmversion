/**
 * Git utilities class
 *
 * @module lib/git
 * @exports GitUtils
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

// Imports

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = require('./utils');

// Here the class
module.exports = function () {
  function GitUtils() {
    _classCallCheck(this, GitUtils);
  }

  _createClass(GitUtils, null, [{
    key: 'createCommit',

    /**
     * Create a commit git
     * @param {string} packageVersion
     * @returns {Promise}
     */
    value: function createCommit(packageVersion) {
      return Utils.promisedExec('git commit --all --message "Release version: ' + packageVersion + '"');
    }

    /**
     * Create a tag git
     * @param {string} packageVersion
     * @returns {Promise}
     */

  }, {
    key: 'createTag',
    value: function createTag(packageVersion) {
      return Utils.promisedExec('git tag "v' + packageVersion + '"');
    }

    /**
     * Push the commits and the tags if needed
     * @param {boolean} [tags=false]
     * @returns {Promise}
     */

  }, {
    key: 'push',
    value: function push(tags) {
      return Utils.promisedExec('git push' + (tags ? ' && git push --tags' : ''));
    }
  }]);

  return GitUtils;
}();
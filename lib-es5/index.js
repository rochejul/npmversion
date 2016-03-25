/**
 * Entry point of the node module
 *
 * @module lib/index
 * @exports NodeVersion
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

/**
 * @name NodeVersion
 */

module.exports = Object.freeze({
  'VersionUtils': require('./version'),
  'GitUtils': require('./git'),
  'versionOptionsAnalyzer': require('./cli-params')
});
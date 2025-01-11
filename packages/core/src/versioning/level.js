/** @import { VersionOptions } from '../config*/

/**
 * @readonly
 * @enum {string}
 */
export const LEVEL_ENUM = Object.freeze({
  major: 'major',
  minor: 'minor',
  patch: 'patch',
  premajor: 'premajor',
  preminor: 'preminor',
  prepatch: 'prepatch',
  prerelease: 'prerelease',
});

/**
 * @param {VersionOptions} [options]
 * @returns {string}
 */
export function getIncrementationLevel(options) {
  let level = options ? options.increment : null;

  if (!level || Object.keys(LEVEL_ENUM).indexOf(level.toLowerCase()) < 0) {
    level = LEVEL_ENUM.patch;
  }

  return level.toLowerCase();
}

import minimist from 'minimist';
import { VersionOptions } from '@npmversion/core';

const MINIMIST_OPTIONS = {
  boolean: [
    'help',
    'unpreid',
    'force-preid',
    'read-only',
    'nogit-commit',
    'nogit-tag',
    'git-push',
  ],
  string: ['increment', 'preid'],
  alias: {
    i: 'increment',
    p: 'preid',
    u: 'unpreid',
  },
  default: VersionOptions.default(),
  stopEarly: true,
};

/**
 * @param {string[]} cliParameters
 * @param {Object} [defaultOptions]
 * @returns {VersionOptions}
 */
export function versionOptionsAnalyzer(cliParameters, defaultOptions) {
  let options = MINIMIST_OPTIONS;

  if (defaultOptions) {
    options = Object.assign({}, MINIMIST_OPTIONS, { default: defaultOptions });
  }

  return new VersionOptions(minimist(cliParameters, options));
}

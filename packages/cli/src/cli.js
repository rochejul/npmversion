import minimist from 'minimist';

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
  default: {
    help: false,
    unpreid: false,
    'read-only': false,
    'force-preid': false,
    'nogit-commit': false,
    'nogit-tag': false,
    'git-push': false,
    increment: 'patch',
    preid: null,
  },
  stopEarly: true,
};

/**
 * @param {string[]} cliParameters
 * @param {Object} [defaultOptions]
 * @returns {NpmVersionOptions}
 */
module.exports = function versionOptionsAnalyzer(
  cliParameters,
  defaultOptions,
) {
  let options = MINIMIST_OPTIONS;

  if (defaultOptions) {
    options = Object.assign({}, MINIMIST_OPTIONS, { default: defaultOptions });
  }

  return minimist(cliParameters, options);
};

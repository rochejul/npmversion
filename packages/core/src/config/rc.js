import rc from 'rc';

import { DEFAULT_OPTIONS } from './default.js';
import { VersionOptions } from './model.js';

const CONFIG_NAME = 'npmversion';

/**
 * @name rcOptionsRetriever
 * @returns {VersionOptions}
 */
export function configRetriever() {
  const {
    config: _config,
    configs: _configs,
    ...versionOptions
  } = rc(CONFIG_NAME, DEFAULT_OPTIONS, []);

  return new VersionOptions(versionOptions);
}

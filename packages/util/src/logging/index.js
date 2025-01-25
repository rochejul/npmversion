import { Logger } from './logger.js';

/**
 * @param {string} stage
 * @returns {Logger}
 */
export function createLogger(stage) {
  return new Logger([stage]);
}

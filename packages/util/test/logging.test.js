import { describe, test, expect, beforeEach } from '@jest/globals';
import '@npmversion/jest-utils';

import { createLogger } from '../src/logging/index.js';
import { Logger } from '../src/logging/logger.js';

describe('@npmversion/util - logging', () => {
  let lastLog;

  beforeEach(() => {
    process.on('log', (level, ...args) => {
      lastLog = { level, args };
    });
  });

  test('createLogger should provide a logger', () => {
    // Act
    const actual = createLogger('first level');

    // Assert
    expect(actual).toBeInstanceOf(Logger);
  });

  describe('for Logger class', () => {
    test('a log event is emitted for error use case', () => {
      // Arrange
      const logger = createLogger('first level');

      // Act
      logger.error('some error');

      // Assert
      expect(lastLog).toMatchPlainObject({
        level: 'error',
        args: ['first level - some error'],
      });
    });

    test('a log event is emitted for info use case', () => {
      // Arrange
      const logger = createLogger('first level');

      // Act
      logger.info('some info');

      // Assert
      expect(lastLog).toMatchPlainObject({
        level: 'info',
        args: ['first level - some info'],
      });
    });

    test('a log event is emitted for verbose use case', () => {
      // Arrange
      const logger = createLogger('first level');

      // Act
      logger.verbose('some verbose');

      // Assert
      expect(lastLog).toMatchPlainObject({
        level: 'verbose',
        args: ['first level - some verbose'],
      });
    });

    test('a log event is emitted for warn use case', () => {
      // Arrange
      const logger = createLogger('first level');

      // Act
      logger.warn('some warn');

      // Assert
      expect(lastLog).toMatchPlainObject({
        level: 'warn',
        args: ['first level - some warn'],
      });
    });

    test('subLogger create logger with addtional stage', () => {
      // Arrange
      const logger = createLogger('first level');

      // Act
      const subLogger = logger.subLogger('second level');
      subLogger.info('some info');

      // Assert
      expect(lastLog).toMatchPlainObject({
        level: 'info',
        args: ['first level - second level - some info'],
      });
    });
  });
});

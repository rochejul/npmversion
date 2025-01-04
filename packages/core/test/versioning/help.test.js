import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import '@npmversion/jest-utils';
import {
  printError,
  printHelp,
  printNotFoundPackageJsonFile,
  printVersion,
} from '../../src/versioning/help';
import {
  GitNotInstalledError,
  NotAGitProjectError,
} from '../../src/versioning/exception.js';
import { NoRemoteGitError, MultipleRemoteError } from '../../src/git';
import * as messages from '../../src/messages.js';

describe('@npmversion/core - versioning/help', () => {
  let processExit;
  let log;
  let error;

  beforeEach(() => {
    processExit = jest.spyOn(process, 'exit').mockImplementation(() => ({}));
    log = jest.spyOn(console, 'log').mockImplementation(() => ({}));
    error = jest.spyOn(console, 'error').mockImplementation(() => ({}));
  });

  test('printHelp should display a message', () => {
    // Act
    printHelp({ version: '1.2.3', description: 'some description' });

    // Assert
    expect(processExit).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(
      messages.HELP_TEXT,
      '1.2.3',
      'some description',
    );
  });

  test('printVersion should display a message', () => {
    // Act
    printVersion('1.2.3');

    // Assert
    expect(processExit).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('Nearest version: ', '1.2.3');
  });

  test('printNotFoundPackageJsonFile should display a message and exit with error', () => {
    // Act
    printNotFoundPackageJsonFile();

    // Assert
    expect(processExit).toHaveBeenCalledWith(1);
    expect(error).toHaveBeenCalledWith(messages.NOT_FOUND_PACKAGE_JSON_FILE);
  });

  describe('printError', () => {
    test('deals with unknow error', () => {
      // Act
      printError('some error message');

      // Assert
      expect(processExit).toHaveBeenCalledWith(1);
      expect(error).toHaveBeenCalledWith('some error message');
    });

    test('deals with GitNotInstalledError', () => {
      // Act
      printError(new GitNotInstalledError());

      // Assert
      expect(processExit).toHaveBeenCalledWith(1);
      expect(error).toHaveBeenCalledWith(messages.GIT_NOT_INSTALLED);
    });

    test('deals with NotAGitProjectError', () => {
      // Act
      printError(new NotAGitProjectError());

      // Assert
      expect(processExit).toHaveBeenCalledWith(1);
      expect(error).toHaveBeenCalledWith(messages.NOT_INTO_GIT_PROJECT);
    });

    test('deals with NoRemoteGitError', () => {
      // Act
      printError(new NoRemoteGitError());

      // Assert
      expect(processExit).toHaveBeenCalledWith(1);
      expect(error).toHaveBeenCalledWith(messages.NO_REMOTE_GIT);
    });

    test('deals with MultipleRemoteError', () => {
      // Act
      printError(new MultipleRemoteError());

      // Assert
      expect(processExit).toHaveBeenCalledWith(1);
      expect(error).toHaveBeenCalledWith(messages.MULTIPLE_REMOTE_GIT);
    });
  });
});

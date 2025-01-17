jest.unstable_mockModule('node:child_process', async () => ({
  exec: jest.fn(),
}));

import { describe, test, expect, jest } from '@jest/globals';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { exec: mockExec } = await import('node:child_process');
const { promisedExec, readFile } = await import('../src/io.js');

describe('@npmversion/util - io', () => {
  describe('promisedExec', () => {
    test('it should resolve the promise when the execution is done', async () => {
      // Arrange
      mockExec.mockImplementation((_command, _options, callback) =>
        callback(null),
      );

      // Act
      const promise = await promisedExec('ls -la', true);

      // Assert
      expect(promise).toBeUndefined();
    });

    test('it should return the command output', async () => {
      // Arrange
      mockExec.mockImplementation((_command, _options, callback) =>
        callback(null, 'return of the command'),
      );

      // Act
      const promise = await promisedExec('ls -la', true);

      // Assert
      expect(promise).toBe('return of the command');
    });

    test('it should reject the promise when the execution is rejected', async () => {
      // Arrange
      mockExec.mockImplementation((_command, _options, callback) =>
        callback(500),
      );

      // Act & Assert
      await expect(async () => promisedExec('ls -la', true)).rejects.toBe(500);
    });

    test('it should use per default the process.cwd', async () => {
      // Arrange
      mockExec.mockImplementation((_command, _options, callback) =>
        callback(null),
      );

      // Act
      await promisedExec('ls -la', true);

      // Assert
      expect(mockExec).toHaveBeenLastCalledWith(
        'ls -la',
        { cwd: process.cwd(), maxBuffer: 20000000 },
        expect.any(Function),
      );
    });

    test('it should use  the specified cwd', async () => {
      // Arrange
      mockExec.mockImplementation((_command, _options, callback) =>
        callback(null),
      );

      // Act
      await promisedExec('ls -la', true, '/etc');

      // Assert
      expect(mockExec).toHaveBeenLastCalledWith(
        'ls -la',
        { cwd: '/etc', maxBuffer: 20000000 },
        expect.any(Function),
      );
    });

    test('it should log the ouput', async () => {
      // Arrange
      const instance = {
        stderr: { on: () => {} },
        stdout: { on: () => {} },
      };

      const stderrOnStub = jest.spyOn(instance.stderr, 'on');
      const stdoutOnStub = jest.spyOn(instance.stdout, 'on');

      mockExec.mockImplementation((_command, _options, callback) => {
        callback(null);
        return instance;
      });

      // Act
      await promisedExec('ls -la', false);

      // Assert
      expect(stderrOnStub).toHaveBeenCalledTimes(1);
      expect(stderrOnStub).toHaveBeenCalledWith('data', expect.any(Function));

      expect(stdoutOnStub).toHaveBeenCalledTimes(1);
      expect(stdoutOnStub).toHaveBeenCalledWith('data', expect.any(Function));
    });
  });

  describe('readFile', () => {
    test('it should reject the promise if we cannot read the file', async () => {
      // Act & Assert
      await expect(async () => readFile('./bower.json')).rejects.toThrow(
        `ENOENT: no such file or directory, open './bower.json'`,
      );
    });

    test('it should return the content of the file', async () => {
      // Arrange
      const filePath = path.resolve(
        path.join(__dirname, './resources/file.txt'),
      );

      // Act
      const content = await readFile(filePath);

      // Assert
      expect(content).toBe('Some content\n');
    });
  });
});

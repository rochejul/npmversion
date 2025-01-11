import { describe, test, expect } from '@jest/globals';
import '@npmversion/jest-utils';

import { spawn } from '../../src/npm/io.js';

describe('@npmversion/workspace - npm/io', () => {
  describe('spawn', () => {
    test('executes the command and returns the output', async () => {
      // Act
      const output = await spawn('ls', ['-la']);

      // Assert
      expect(output).not.toBeNull();
    });
  });
});

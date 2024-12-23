import { expect } from '@jest/globals';
import { plainObject } from './object.js';

expect.extend({
  toMatchPlainObject(received, expected) {
    const receivedPlainObject = plainObject(received);
    const pass = this.equals(receivedPlainObject, expected, [], true);

    if (pass) {
      return {
        message: () =>
          `Expected: ${this.utils.printExpected(expectedResult)}\nReceived: ${this.utils.printReceived(received)}`,
        pass: true,
      };
    }

    return {
      message: () =>
        `Expected: ${this.utils.printExpected(expectedResult)}\nReceived: ${this.utils.printReceived(
          received,
        )}\n\n${this.utils.diff(expectedResult, received)}`,
      pass: false,
    };
  },
});

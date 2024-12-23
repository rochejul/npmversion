import { expect } from '@jest/globals';
import { plainObject } from './object.js';

expect.extend({
  toMatchPlainObject(received, expected) {
    const receivedPlainObject = plainObject(received);
    const pass = this.equals(receivedPlainObject, expected, [], true);

    if (pass) {
      return {
        message: () =>
          `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(receivedPlainObject)}`,
        pass: true,
      };
    }

    return {
      message: () =>
        `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(
          receivedPlainObject,
        )}\n\n${this.utils.diff(expected, receivedPlainObject)}`,
      pass: false,
    };
  },
});

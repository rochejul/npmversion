/**
 * Promises tests
 *
 * @module test/promises-spec
 * @author Julien Roche
 * @version 1.6.0
 * @since 1.6.0
 */

'use strict';

describe('Promises  - ', function () {
  const expect = require('chai').expect;
  const sinon = require('sinon');
  const Promises = require('../lib/promises');

  let sinonSandBox;

  it('should exports something', function () {
    expect(Promises).to.exist;
  });

  beforeEach(function () {
    sinonSandBox = sinon.sandbox.create();
  });

  afterEach(function () {
    sinonSandBox && sinonSandBox.restore();
    sinonSandBox = null;
  });

  describe('and the method "pool" ', function () {
    it('should exist', function () {
      expect(Promises.sequential).to.exist;
    });

    it('should execute pool the promises in parallel', function () {
      let timeouts = [750, 150, 350];
      let inc = 0;

      return Promises.pool((index) => {
        if (index >= timeouts.length) {
          return null;
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            inc++;
            resolve(`Used timeout: ${timeouts[index]} / inc: ${inc}`);
          }, timeouts[index]);
        });
      }).then((results) => {
        expect(results).deep.equals([
          'Used timeout: 750 / inc: 3',
          'Used timeout: 150 / inc: 1',
          'Used timeout: 350 / inc: 2',
        ]);
      });
    });

    it('should adapt the logic on pool size', function () {
      let timeouts = [750, 150, 350];
      let inc = 0;

      return Promises.pool((index) => {
        if (index >= timeouts.length) {
          return null;
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            inc++;
            resolve(`Used timeout: ${timeouts[index]} / inc: ${inc}`);
          }, timeouts[index]);
        });
      }, 1).then((results) => {
        expect(results).deep.equals([
          'Used timeout: 750 / inc: 1',
          'Used timeout: 150 / inc: 2',
          'Used timeout: 350 / inc: 3',
        ]);
      });
    });
  });

  describe('and the method "sequential" ', function () {
    it('should exist', function () {
      expect(Promises.sequential).to.exist;
    });

    it('should execute sequentially the promises sequentially', function () {
      let timeouts = [750, 150, 350];
      let inc = 0;

      return Promises.sequential((index) => {
        if (index >= timeouts.length) {
          return null;
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            inc++;
            resolve(`Used timeout: ${timeouts[index]} / inc: ${inc}`);
          }, timeouts[index]);
        });
      }).then((results) => {
        expect(results).deep.equals([
          'Used timeout: 750 / inc: 1',
          'Used timeout: 150 / inc: 2',
          'Used timeout: 350 / inc: 3',
        ]);
      });
    });
  });
});

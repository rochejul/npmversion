/**
 * Promises utilities class
 *
 * @module lib/promises
 * @exports Promises
 * @author Julien Roche
 * @version 1.6.0
 * @since 1.6.0
 */

'use strict';

// Constants & variables
const DEFAULT_POOL_SIZE = 10;

/**
 * @callback Promise.pool~producer
 * @param {number} index
 * @returns {Promise}
 */

// Here the class
class Promises {
    /**
     * @param {Promise.pool~producer} producer
     * @param {number} [concurrency=10]
     * @return {Promise<any>}
     */
    static pool(producer, concurrency) {
        return new Promise((resolve, reject) => {
            let index = 0;
            let finished = false;
            let returnedValues = [];
            let concurrencyToUse = concurrency ? concurrency : DEFAULT_POOL_SIZE;
            let nbInstances = concurrencyToUse;
            let mainPromise = Promise.resolve();

            function onError(err) {
                if (!finished) {
                    finished = true;
                    reject(err);
                }
            }

            function onSuccess(value) {
                returnedValues.push(value);

                if (!finished) {
                    if (nbInstances < concurrencyToUse) {
                        nbInstances++;
                        process();
                    }
                }
            }

            function process() {
                while (!finished && nbInstances > 0) {
                    let lastPromise = producer(index);
                    index++;
                    nbInstances--;

                    if (!lastPromise) {
                        mainPromise
                            .then(() => {
                                resolve(returnedValues);
                                return returnedValues;
                            })
                            .catch(onError);

                    } else {
                        mainPromise = mainPromise
                            .then(() => {
                                return lastPromise
                                    .then(onSuccess)
                                    .catch(onError);
                            });
                    }
                }
            }

            process();
        });
    }

    /**
     * @param {Promise.pool~producer} producer
     * @return {Promise<any>}
     */
    static sequential(producer) {
        return Promises.pool(producer, 1);
    }
}

module.exports = Promises;

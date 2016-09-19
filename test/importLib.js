'use strict';

function importLib (path) {
    if (process.env.ES_ENV === 'es5') {
        return require(`../lib-es5/${path}`);
    }

    return require(`../lib/${path}`);
};

importLib.getContext = function () {
    return process.env.ES_ENV === 'es5' ? ' (in es5 mode)' : '';
};

module.exports = importLib;

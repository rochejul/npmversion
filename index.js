'use strict';

// Nota Bene: do not use es6 syntax here to deal with a fallback
var semver = require('semver');

if (semver.lt(process.version, '4.0.0')) {
    module.exports = require('./lib-es5/index');

} else {
    // Use ES6 modules
    module.exports = require('./lib/index');
}

'use strict';

/*
Require this file inside tests
 */

require('./bootstrap');
global.t = require('chai').assert;

// Extend
t.isPrettyError = function (err, code, message) {
  t.instanceOf(err, PrettyError);
  t.ok(err instanceof PrettyError, err.toJSON());
  t.strictEqual(err.code, code, 'pretty errorr ' + err.toString() + ' code should be code=' + code);

  if (message) {
    t.include(err.message, message);
  }
};

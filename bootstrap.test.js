'use strict';

/*
Require this file inside tests
 */

require('./.env.test');
require('./bootstrap');
global.t = require('chai').assert;
global.request = require('supertest');

// Extend
t.isPrettyError = function (err, code, message) {
  t.instanceOf(err, PrettyError);
  t.ok(err instanceof PrettyError, err.toJSON());
  t.strictEqual(err.code, code, 'pretty errorr ' + err.toString() + ' code should be code=' + code);

  if (message) {
    t.include(err.message, message);
  }
};

/**
 * @param  {Function} f(app, config, logger, es, amqp)
 */
t.getAPP = function getAPP(f) {
  require('./server')(function (app, config, logger, es, amqp) {
    // ensure that we are using test configuration
    assert(!_.contains(config.amqp.host, 'rabbitmq.redsmin.com'));
    assert(!_.contains(config.elasticsearch.host, 'elasticsearch.redsmin.com'));
  });
};

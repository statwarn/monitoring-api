'use strict';

/*
Require this file inside tests
 */
require('./bootstrap');

var fs = require('fs');

if (!process.env.OVERRIDE) {
  _.compact(fs.readFileSync('./ci/.env_test').toString('utf8').split('\n')).forEach(function (line) {
    var pair = _.rest(line.split('export ')).join(' ').split('=').map(function trim(v) {
      return v.trim();
    });

    process.env[pair[0]] = pair[1].replace(/"/g, '');
  });
}

// ensure that we are running the tests in dev env
assert(process.env.AMQP_VHOST === 'test');
assert(process.env.ELASTICSEARCH_HOST_HOST === 'redsmintest.west-eu.azr.facetflow.io');

var ServerFactory = require('./server');
global.t = require('chai').assert;
global.request = require('supertest');

// Extend
t.isPrettyError = function (err, code, message) {
  t.instanceOf(err, PrettyError);
  t.ok(err instanceof PrettyError, err.toJSON());
  t.strictEqual(err.code, code, 'pretty error ' + err.toString() + ' code should be code=' + code);

  if (message) {
    t.include(err.message, message);
  }
};

/**
 * @param  {Function} f(app, config, logger, es, amqp)
 */
t.getAPP = function getAPP(f) {
  ServerFactory(function (app, config, logger, es, amqp) {
    // ensure that we are using test configuration
    assert(_.contains(config.amqp.vhost, 'test'));
    assert(!_.contains(config.elasticsearch.host, 'elasticsearch.redsmin.com'));

    f(app, config, logger, es, amqp);
  }, _.noop, {
    amqpError: true
  });
};

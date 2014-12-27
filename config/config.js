'use strict';

module.exports = function (logger) {
  var env = require('common-env')(logger);

  return env.getOrElseAll({
    api: {
      port: 9000
    },

    elasticsearch: {
      host: {
        protocol: 'http',
        host: 'localhost',
        port: 9200,
        auth: ''
      },

      // String, String[], Object, Object[], Constructor — Unless a constructor is specified, this sets the output settings for the bundled logger. See the section on configuring-logging[logging] for more information.
      log: 'debug',

      // Integer — How many times should the client try to connect to other nodes before returning a ConnectionFault error.
      maxRetries: 5,

      // Number — Milliseconds before an HTTP request will be aborted and retried. This can also be set per request.
      requestTimeout: 5000,

      // Number — Milliseconds that a dead connection will wait before attempting to revive itself.
      deadTimeout: 1000,
      index: {
        name_prefix: 'monitoring',
        document: {
          type: 'measurement'
        }
      }
    },

    amqp: {
      login: 'guest',
      password: 'guest',
      host: 'localhost',
      port: 5672,
      vhost: '',

      publish: {
        // Publish new measurement on exchange
        exchange: 'monitoring',
        key_suffix: 'monitoring.new'
      }
    }
  });
};

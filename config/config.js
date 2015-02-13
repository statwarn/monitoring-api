'use strict';

module.exports = function (logger) {
  var env = require('common-env')(logger);

  var config = env.getOrElseAll({
    statwarn: {
      schema: {
        monitoring: {
          create: 'application/vnd.com.statwarn.monitoring.create.v1+json'
        }
      },
      monitoring: {
        api: {
          port: 9000
        }
      }
    },

    elasticsearch: {
      host: {
        protocol: 'http',
        host: 'localhost',
        port: 9200,
        auth: ''
      },

      // String, String[], Object, Object[], Constructor — Unless a constructor is specified, this sets the output settings for the bundled logger. See the section on configuring-logging[logging] for more information.
      // error, warning, info, debug, trace
      // Event fired for "info" level log entries, which usually describe what a client is doing (sniffing etc)
      // Event fired for "debug" level log entries, which will describe requests sent,
      log: 'info',

      // Integer — How many times should the client try to connect to other nodes before returning a ConnectionFault error.
      maxRetries: 5,

      // Number — Milliseconds before an HTTP request will be aborted and retried. This can also be set per request.
      requestTimeout: 10000,

      // Number — Milliseconds that a dead connection will wait before attempting to revive itself.
      deadTimeout: 1000,
      index: {
        template: 'defined/redsmin.template.js',
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        },
        name_prefix: 'statwarn',
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
        publish_key: 'monitoring.create'
      }
    }
  });

  // export env
  config.env = env;

  return config;
};

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
      log: 'trace',
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
      port: 5672
    }
  });
};

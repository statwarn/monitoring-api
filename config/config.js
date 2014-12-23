'use strict';

module.exports = function (logger) {
  var env = require('common-env')(logger);

  return env.getOrElseAll({
    api: {
      port: 9000
    },

    elasticsearch: {
      host: 'localhost:9200',
      log: 'trace'
    },

    amqp: {
      login: 'guest',
      password: 'guest',
      host: 'localhost',
      port: 5672
    }
  });
};

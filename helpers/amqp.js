'use strict';
var amqp = require('amqp-dsl');

module.exports = function (config, logger) {
  return function connect(obj, f) {
    var conn = amqp.login(config);

    conn.on('error', function (err) {
      logger.error("AMQP ERROR", err);
      throw err;
    });

    (obj.queues || []).forEach(function (queueName) {
      conn.queue(queueName, {
        passive: true
      });
    });

    (obj.exchanges || []).forEach(function (exchangeName) {
      conn.exchange(exchangeName, {
        passive: true
      });
    });

    conn.connect(f);
  };
};

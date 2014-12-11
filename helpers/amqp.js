'use strict';
var amqp = require('amqp-dsl');

module.exports = function(config){
  return function connect(obj, f){
    var conn = amqp.login(config.amqp);

    conn.on('error', function(err){
      throw err;
    });

    (obj.queues || []).forEach(function(queueName){
      conn.queue(queueName, {passive:true});
    });

    (obj.exchanges || []).forEach(function(exchangeName){
      conn.exchange(exchangeName, {passive:true});
    });

    conn.connect(f);
  };
};


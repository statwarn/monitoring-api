'use strict';
module.exports = function (es, amqp) {
  return {
    // Entity
    // entity can only require other entity
    Metric: require('./Metric'),

    // Repository
    // repository can require es, amqp and other entities
    Metrics: require('./Metrics')(es, amqp)
  };
};

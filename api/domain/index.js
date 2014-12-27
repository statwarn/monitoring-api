'use strict';

module.exports = function (es, amqp, config) {
  return {
    // Entities
    // entities can only require other entities
    Measurement: require('./Measurement.Entity'),

    // Repositories
    // repository can require es, amqp and other entities
    Measurements: require('./Measurement.Repository')(es, amqp, config),

    // Value Object
    DateRangeInterval: require('./DateRangeInterval.ValueObject')
  };
};

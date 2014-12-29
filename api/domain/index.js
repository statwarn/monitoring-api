'use strict';

module.exports = function (es, amqp, config, template) {
    var DateRangeInterval = require('./DateRangeInterval.ValueObject')();
    return {
        // Entities
        // entities can only require other entities
        Measurement: require('./Measurement.Entity'),

        // Repositories
        // repository can require es, amqp and other entities
        Measurements: require('./Measurement.Repository')(es, amqp, config, DateRangeInterval),

        // Value Object
        DateRangeInterval: DateRangeInterval,
        Template: require('./Template.ValueObject')(es, config, template)
    };
};

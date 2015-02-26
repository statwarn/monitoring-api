'use strict';
require('../../bootstrap.test');

var Measurement = require('./Measurement.Entity');

describe('Measurement', function () {
  describe('Measurement.fromJSON', function () {
    it('should return an error if we try to pass it a nested object', function () {
      var err = Measurement.fromJSON('random-id', {
        timestamp: 1388250221005,
        data: {
          uptime_in_seconds: 1588578,
          connected: 1,
          commands: {
            plop: 1
          }
        }
      });

      t.isPrettyError(err, 400);
    });

    it('should return an error if the measurement id is too long', function () {
      var MEASUREMENT_ID = _.repeat('-', 150);

      var err = Measurement.fromJSON(MEASUREMENT_ID, {
        timestamp: 1388250221005,
        data: {
          uptime_in_seconds: 1588578,
          connected: 1
        }
      });

      t.isPrettyError(err, 400);
    });

    it('should return an error if the measurement id is too short', function () {
      var MEASUREMENT_ID = _.repeat('-', 1);

      var err = Measurement.fromJSON(MEASUREMENT_ID, {
        timestamp: 1388250221005,
        data: {
          uptime_in_seconds: 1588578,
          connected: 1
        }
      });

      t.isPrettyError(err, 400);
    });

    it('should return an valid measurement', function () {
      var MEASUREMENT_ID = 'this-is-a-test';

      var measurement = Measurement.fromJSON(MEASUREMENT_ID, {
        timestamp: 1388250221005,
        data: {
          uptime_in_seconds: 1588578,
          connected: 1
        }
      });

      t.instanceOf(measurement, Measurement);
    });
  });
});

'use strict';
require('../../bootstrap.test');

var Measurement = require('./Measurement.Entity');

describe('Measurement', function () {
  describe('Measurement.fromJSON', function () {
    it('should return an error if we try to pass it a nested object', function () {
      var err = Measurement.fromJSON({
        id: 'random-id',
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
  });
});

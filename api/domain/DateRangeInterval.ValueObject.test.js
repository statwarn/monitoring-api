'use strict';
require('../../bootstrap.test');

var DateRangeInterval = require('./DateRangeInterval.ValueObject')();

describe('DateRangeInterval', function () {
  describe('DateRangeInterval.fromReq', function () {
    it('should return an error if the query is not defined', function (done) {
      t.isPrettyError(DateRangeInterval.fromReq(), 400);
      done();
    });

    it('should return an error if the interval is not defined', function (done) {
      t.ok(DateRangeInterval.fromReq({
        query: {}
      }) instanceof PrettyError, 'should be a pretty error');
      // @todo check error.details
      t.qsodifjqosijfd();
      done();
    });

    it('should return an error if the interval is defined but invalid', function (done) {
      t.ok(DateRangeInterval.fromReq({
        query: {
          interval: 'plop'
        }
      }) instanceof PrettyError, 'should be a pretty error');
      // @todo check error.details
      done();
    });

    it('should return an interval if the interval is valid', function (done) {
      var dateRangeInterval = DateRangeInterval.fromReq({
        query: {
          interval: 'minute',
          start_ts: String(+new Date() - 3600 * 60 * 1000), // -1 hour
          end_ts: String(+new Date()), // we convert *_ts to string because it will always be sent as string
        }
      });

      if (dateRangeInterval instanceof PrettyError) {
        console.error(dateRangeInterval);
      }

      t.ok(dateRangeInterval instanceof DateRangeInterval, 'should be an instance of interval is valid');
      done();
    });
  });
});

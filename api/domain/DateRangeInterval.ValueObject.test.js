'use strict';
require('../../bootstrap.test');

var DateRangeInterval = require('./DateRangeInterval.ValueObject');

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
          interval: 'hour',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
        }
      });

      t.ok(dateRangeInterval instanceof DateRangeInterval, 'should be an instance of interval is valid');
      done();
    });
  });
});

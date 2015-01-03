'use strict';
require('../../bootstrap.test');

var DateRangeInterval = require('./DateRangeInterval.ValueObject')();
var MeasurementQuery = require('./MeasurementQuery.ValueObject')(DateRangeInterval);

describe('MeasurementQuery', function () {
  var dateRangeInterval;
  beforeEach(function () {
    dateRangeInterval = new DateRangeInterval();
  });

  describe('MeasurementQuery.fromReq', function () {
    it('should return an error if the query is not defined', function (done) {
      t.isPrettyError(MeasurementQuery.fromReq(), 400);
      done();
    });

    it('should return an error if the interval is not defined', function (done) {
      t.ok(MeasurementQuery.fromReq({
        query: {}
      }) instanceof PrettyError, 'should be a pretty error');
      // @todo check error.details
      done();
    });

    it('should return an error if id or ids are not present', function (done) {
      var err = MeasurementQuery.fromReq({
        query: {
          interval: 'plop'
        }
      }, dateRangeInterval);
      t.ok(err instanceof PrettyError, 'should be a pretty error');
      t.include(err.message, 'id or ids');
      done();
    });

    it('should return an error if field or fields are not present', function (done) {
      var err = MeasurementQuery.fromReq({
        query: {
          interval: 'plop',
          id: '10'
        }
      }, dateRangeInterval);
      t.ok(err instanceof PrettyError, 'should be a pretty error');
      t.include(err.message, 'field or fields');
      done();
    });

    it('should return return an erreur if the specified aggregates don\'t match the fields count', function (done) {
      var err = MeasurementQuery.fromReq({
        query: {
          interval: 'plop',
          id: '10',
          fields: ['a', 'b'],
          agg: 'a'
        }
      }, dateRangeInterval);
      t.ok(err instanceof PrettyError, 'should be a pretty error');
      t.include(err.message, 'specified an aggregation type');
      done();
    });

    it('should return specify a default aggregate the same size as fields', function (done) {
      var measurementQuery = MeasurementQuery.fromReq({
        query: {
          id: '10',
          fields: ['plop', 'plop']
        }
      }, dateRangeInterval);
      t.deepEqual(measurementQuery.aggs, ['min', 'min']);
      done();
    });
  });
});

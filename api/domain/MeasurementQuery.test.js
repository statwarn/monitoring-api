'use strict';
require('../../bootstrap.test');

var DateRangeInterval = require('./DateRangeInterval.ValueObject')();
var MeasurementQuery = require('./MeasurementQuery.ValueObject')(DateRangeInterval);

describe('MeasurementQuery', function () {
  var dateRangeInterval;
  beforeEach(function () {
    dateRangeInterval = new DateRangeInterval(1420293008365, 1420294008365, 'minute');
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
      t.deepEqual(measurementQuery.aggs, ['avg', 'avg']);
      done();
    });
  });

  describe('MeasurementQuery', function () {
    var measurementQuery;

    beforeEach(function () {
      measurementQuery = MeasurementQuery.fromReq({
        query: {
          id: '10',
          fields: ['plop', 'plop']
        }
      }, dateRangeInterval);
    });

    describe('::buildQuery', function () {
      it('should return an query', function (done) {
        var makeIndexFromId = _.identity;
        var index_document_type = 'plop';
        var query = measurementQuery.buildQuery(makeIndexFromId, index_document_type);
        t.strictEqual(query.type, index_document_type);
        t.deepEqual(query, {
          "indices": ["10"],
          "type": "plop",
          "fields": ["plop", "plop"],
          "search_type": "count",
          "body": {
            "size": 0,
            "query": {
              "range": {
                "timestamp": {
                  "from": 1420293008365,
                  "to": 1420294008365
                }
              }
            },
            "aggs": {
              "volume": {
                "date_histogram": {
                  "field": "timestamp",
                  "min_doc_count": 0,
                  "interval": "minute",
                  "extended_bounds": {
                    "min": 1420293008365,
                    "max": 1420294008365
                  }
                },
                "aggs": {
                  "plop": {
                    "avg": {
                      "field": "plop"
                    }
                  }
                }
              }
            }
          }
        });
        done();
      });

      describe('::parseResults', function () {

      });
    });
  });
});

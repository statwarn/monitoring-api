'use strict';
require('../../bootstrap.test');

var DateRangeInterval = require('./DateRangeInterval.ValueObject')();
var MeasurementQuery = require('./MeasurementQuery.ValueObject')(DateRangeInterval);
var Fixtures = require('./MeasurementQuery.test.fixture');


describe('MeasurementQuery', function () {
  var dateRangeInterval;
  beforeEach(function () {
    dateRangeInterval = new DateRangeInterval(1420293008365, 1420294008365, 'minute');
  });

  describe('MeasurementQuery.fromReq', function () {
    it('should return an error if the query is not defined', function () {
      t.isPrettyError(MeasurementQuery.fromReq(), 400);
    });

    it('should return an error if the interval is not defined', function () {
      t.ok(MeasurementQuery.fromReq({
        query: {}
      }) instanceof PrettyError, 'should be a pretty error');
      // @todo check error.details
    });

    it('should return an error if id or ids are not present', function () {
      var err = MeasurementQuery.fromReq({
        query: {
          interval: 'plop'
        }
      }, dateRangeInterval);
      t.ok(err instanceof PrettyError, 'should be a pretty error');
      t.include(err.message, 'id or ids');
    });

    it('should return an error if field or fields are not present', function () {
      var err = MeasurementQuery.fromReq({
        query: {
          interval: 'plop',
          id: '10'
        }
      }, dateRangeInterval);
      t.ok(err instanceof PrettyError, 'should be a pretty error');
      t.include(err.message, 'field or fields');
    });

    it('should return an error if filter or filters exists and is not a string', function () {
      var err = MeasurementQuery.fromReq({
        query: {
          interval: 'plop',
          id: '10',
          field: 'a',
          agg: 'a',
          filter: 3
        }
      }, dateRangeInterval);
      t.ok(err instanceof PrettyError, 'should be a pretty error');
      t.include(err.message, 'filter or filters');
    });

    it('should return return an error if the specified aggregates don\'t match the fields count', function () {
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
    });

    it('should return specify a default aggregate the same size as fields', function () {
      var measurementQuery = MeasurementQuery.fromReq({
        query: {
          id: '10',
          fields: ['plop', 'plop']
        }
      }, dateRangeInterval);
      t.deepEqual(measurementQuery.aggs, ['avg', 'avg']);
    });
  });

  describe('MeasurementQuery', function () {
    var measurementQuery;


    describe('::buildQuery', function () {
      beforeEach(function () {
        measurementQuery = MeasurementQuery.fromReq({
          query: {
            id: '10',
            fields: ['plop', 'plop'],
            filters: 'data.server_id == "549db2d721a4764672000397" and data.used_memory > 9000'
          }
        }, dateRangeInterval);
      });

      it('should return an query', function () {
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
              "filtered": {
                "filter": {
                  "bool": {
                    "must": [{
                        "range": {
                          "timestamp": {
                            "from": 1420293008365,
                            "to": 1420294008365
                          }
                        }
                      },
                      [{
                        "bool": {
                          "must": [{
                            "term": {
                              "data.server_id": "549db2d721a4764672000397"
                            }
                          }, {
                            "range": {
                              "data.used_memory": {
                                "gt": 9000
                              }
                            }
                          }]
                        }
                      }]
                    ]
                  }
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
      });
    });

    describe('::parseResults', function () {

      describe('... with a single field', function () {
        var result;
        beforeEach(function () {
          measurementQuery = MeasurementQuery.fromReq({
            query: {
              id: '10',
              field: 'used_memory',
              agg: 'avg'
            }
          }, dateRangeInterval);
          result = measurementQuery.parseResults(Fixtures.single_field_used_memory_agg_stats);
        });

        it('should return an array', function () {
          t.isArray(result);
        });

        it('should return an array or object', function () {
          result.every(_.isObject);
        });

        it('should return a single object (1 field and 1 series)', function () {
          assert(measurementQuery.ids.length, 1);
          t.strictEqual(result.length, measurementQuery.ids.length);
        });

        it('should return an object for each series', function () {
          var firstResult = _.chain(result).first().value();

          t.deepEqual(_.omit(firstResult, 'values'), {
            id: measurementQuery.ids[0],
            field: measurementQuery.fields[0]
          });
        });

        // @todo test values
      });

      describe('... with multiple fields', function () {
        var result;
        beforeEach(function () {
          measurementQuery = MeasurementQuery.fromReq({
            query: {
              id: '10',
              fields: ['used_memory', 'used_memory_rss'],
              aggs: ['avg', 'stats']
            }
          }, dateRangeInterval);
          result = measurementQuery.parseResults(Fixtures.multiple_fields_used_memory_and_used_memory_rss_agg_avg_and_stats);
        });

        it('should return 2 root objects (1 field and 1 series)', function () {
          assert(measurementQuery.ids.length, 1);
          t.strictEqual(result.length, measurementQuery.fields.length);
        });

        describe('the first main object field=used_memory, agg=avg', function () {
          var obj;
          beforeEach(function () {
            obj = _.chain(result).head().value();
          });

          it('should be an object with the right id and field', function () {
            t.deepEqual(_.omit(obj, 'values'), {
              id: '10',
              field: 'used_memory'
            });
          });

          it('should have a values array', function () {
            t.isArray(obj.values);
          });

          it('should have a values array and each values should have `avg` aggregate attributes', function () {
            t.deepEqual(_.first(obj.values), {
              timestamp: 1388332440000,
              value: 3626992
            });
          });
        });

        describe('the first main object field=used_memory_rss, agg=stats', function () {
          var obj;
          beforeEach(function () {
            obj = _.chain(result).rest().head().value();
          });

          it('should be an object with the right id and field', function () {
            t.deepEqual(_.omit(obj, 'values'), {
              id: '10',
              field: 'used_memory_rss'
            });
          });

          it('should have a values array', function () {
            t.isArray(obj.values);
          });

          it('should have a values array and each values should have `avg` aggregate attributes', function () {
            t.deepEqual(_.first(obj.values), {
              "timestamp": 1388332440000,
              "count": 1,
              "min": 2912256,
              "max": 2912256,
              "avg": 2912256,
              "sum": 2912256,
              "sum_of_squares": 8481235009536,
              "variance": 0,
              "std_deviation": 0
            });
          });
        });
      });
    });
  });
});

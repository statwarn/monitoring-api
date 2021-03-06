'use strict';
require('../../bootstrap.test');

var logger = require('../../helpers/logger');
var config = require('../../config')(logger);
var INDEX_NAME_PREFIX = config.elasticsearch.index.name_prefix;
var INDEX_DOCUMENT_TYPE = config.elasticsearch.index.document.type;
var connectAndCheckES = require('../../helpers/elasticsearch')(config.elasticsearch);
var testObjCollection = require('./Measurement.Repository.test.fixture');
var Measurement;

describe('Measurement Repository', function () {
  describe('Measurement.describe', function () {

    // insert tests documents into monitoring-test/measurement
    before(function (done) {
      connectAndCheckES(function (err, es) {
        Measurement = require('./Measurement.Repository')(es, {
          publishExchange: {
            publish: function (a, b, c, f) {
              f();
            }
          }
        }, config);

        async.eachSeries(testObjCollection, function postDummyOnES(obj, cb) {
          var id = 'test';
          var entity = require('./Measurement.Entity').fromJSON(id, {
            timestamp: _.now(),
            data: obj
          });

          Measurement.create(entity, function (err) {
            if (err) {
              throw err;
            }
            cb();
          });
        }, function () {
          setTimeout(function () {
            done();
          }, 2000);
        });
      });
    });

    // remove those documents
    after(function (done) {
      connectAndCheckES(function (err, es) {
        es.deleteByQuery({
          index: INDEX_NAME_PREFIX + '-test',
          type: INDEX_DOCUMENT_TYPE,
          body: {
            query: {
              match_all: {}
            }
          }
        }, function (err) {
          if (err) {
            throw err;
          }
          done();
        });
      });
    });

    it('should return a PrettyError', function (done) {
      var id = 'plop';
      var size = 10;
      Measurement.describe(id, size, function (err) {
        t.isPrettyError(err, 500);
        done();
      });
    });

    it('should return the whole collection because of size 10', function (done) {
      var id = 'test';
      var size = 10;

      Measurement.describe(id, size, function (err, keys) {
        t.equal(err instanceof PrettyError, false);
        t.deepEqual(keys, {
          a: 'number',
          b: 'string',
          c: 'boolean'
        });
        done();
      });
    });

    it('should return the first two documents merged ', function (done) {
      var id = 'test';
      var size = 2;
      Measurement.describe(id, size, function (err, keys) {
        t.equal(err instanceof PrettyError, false);
        t.deepEqual(keys, {
          b: 'string',
          c: 'boolean'
        });
        done();
      });
    });
  });
});

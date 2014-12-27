'use strict';

// MeasurementRepository
module.exports = function (es, amqp, config) {
  assert(_.isString(config.elasticsearch.index.name_prefix));
  assert(_.isString(config.elasticsearch.index.document.type));
  assert(amqp.publishExchange);

  var INDEX_NAME_PREFIX = config.elasticsearch.index.name_prefix;
  var INDEX_DOCUMENT_TYPE = config.elasticsearch.index.document.type;

  var Measurement = require('./Measurement.Entity');
  var DateRangeInterval = require('./DateRangeInterval.ValueObject');

  return {
    /**
     * Create a measurement inside storage backend
     * @param  {Measurement} metric
     * @param  {Function} f(PrettyError)
     */
    create: function (measurement, f) {
      assert(measurement instanceof Measurement);

      // first write the measurement in ES
      es.create({
        index: INDEX_NAME_PREFIX + '-' + measurement.id,
        type: INDEX_DOCUMENT_TYPE,
        body: measurement
      }, function (err, res) {
        if (err) {
          return f(new PrettyError(500, 'An error occured will creating the measurement', err));
        }

        if (!_.isPlainObject(res) || !res.created) {
          return f(new PrettyError(500, 'Could not create the measurement', err));
        }

        // then publish it in AMQP
        // @todo add a callback to publish and only then, acknowledge the write
        amqp.publishExchange.publish('monitoring.new', measurement, {
          mandatory: true,
          confirm: true,
          exchange: 'monitoring'
        }, function onConfirm() {
          f(null);
        });
      });
    },

    // histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-histogram-aggregation.html
    // date histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html
    findByIds: function (ids, keys, dateRangeInterval, f) {
      assert(dateRangeInterval instanceof DateRangeInterval);

      // toElasticField(ids, 'monitoring', function (err, indices) {
      //   toElasticField(keys, 'keys.', function (err, keys) {
      //     if (err) {
      //       return f(err);
      //     }
      //     es.search({
      //       indices: indices,
      //       type: 'metric',
      //       fields: ['server_id', 'timestamp'].concat(metrics),
      //       body: {
      //         "aggs": {
      //           "volume": {
      //             "date_histogram": {
      //               "field": "timestamp",
      //               "min_doc_count": 0,
      //               "interval": precision,
      //               "extended_bounds": {
      //                 "min": new Date(start).getTime(),
      //                 "max": new Date(end).getTime()
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }, function (err, res) {
      //       if (err) {
      //         return f(500, 'could not get the metrics', err);
      //       }

      //       // function (err, metrics) {
      //       //   if (err) {
      //       //     return f(new PrettyError(500, 'cannot convert response to metrics', err));
      //       //   }
      //       //   return f(null, res.hits.hits);
      //       // });
      //     });
      //   });
      // });
    }
  };
};

// function toElasticField(field, text, f) {
//   function iterator(field, cb) {
//     return cb(null, text + field);
//   }

//   async.map(field.split(','), iterator, function (err, fields) {
//     if (err) {
//       return f(new PrettyError(400, 'at least one ' + field + ' is invalid', err));
//     }
//     f(null, fields);
//   });
// }

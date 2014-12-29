'use strict';

// MeasurementRepository
module.exports = function (es, amqp, config, DateRangeInterval) {
  assert(_.isString(config.elasticsearch.index.name_prefix));
  assert(_.isString(config.elasticsearch.index.document.type));
  assert(amqp.publishExchange);

  var INDEX_NAME_PREFIX = config.elasticsearch.index.name_prefix;
  var INDEX_DOCUMENT_TYPE = config.elasticsearch.index.document.type;

  var Measurement = require('./Measurement.Entity');

  function makeIndexFromId(id) {
    return INDEX_NAME_PREFIX + '-' + id;
  }

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
        index: makeIndexFromId(measurement.id),
        type: INDEX_DOCUMENT_TYPE,
        body: measurement.toDocument()
      }, function (err, res) {
        if (err) {
          return f(new PrettyError(500, 'An error occured will creating the measurement', err));
        }

        if (!_.isPlainObject(res) || !res.created) {
          return f(new PrettyError(500, 'Could not create the measurement', err));
        }

        // then publish it in AMQP
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
    findByIds: function (ids, fields, dateRangeInterval, f) {
      console.log(ids, fields, dateRangeInterval);
      assert(_.isArray(ids));
      assert(_.isArray(fields));
      assert(dateRangeInterval instanceof DateRangeInterval);

      es.search({
        indices: ids.map(makeIndexFromId),
        type: INDEX_DOCUMENT_TYPE,
        fields: fields,
        // search_type: 'count',

        body: {
          // size=0 to not show search hits because we only want to see the aggregation results in the response.
          size: 0,

          query: {
            range: {
              timestamp: {
                from: dateRangeInterval.start_ts,
                to: dateRangeInterval.end_ts
              }
            }
          },
          aggs: {
            volume: {
              date_histogram: {
                field: 'timestamp',
                min_doc_count: 0,
                interval: dateRangeInterval.interval
              },
              aggs: {
                'used_memory': {
                  avg: {
                    field: 'used_memory'
                  }
                }
              }
            }
          }
        }
      }, function (err, res) {
        console.log(err, res);

        if (err) {
          return f(new PrettyError('plop', 'plop', err));
        }

        return f(null, res);
      });
    }
  };
};

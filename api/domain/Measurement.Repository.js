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
    /**
     * [findByIds description]
     * @param  {Array} ids
     * @param  {Array} fields
     * @param  {DateRangeInterval} dateRangeInterval
     * @param  {Function} f(err: PrettyError, data: Array, took: Number)
     */
    findByIds: function (ids, fields, dateRangeInterval, f) {
      assert(_.isArray(ids));
      assert(_.isArray(fields));
      assert(dateRangeInterval instanceof DateRangeInterval);

      var fields_aggs = fields.reduce(function (obj, field, i) {
        // obj, is an object of:
        //
        // 'used_memory': {
        //   avg: {
        //     field: 'used_memory'
        //   }
        // }
        //
        // with "used_memory" == field

        obj[field] = {};
        obj[field]['avg'] = {
          field: field
        };
        return obj;
      }, {});

      es.search({
        indices: ids.map(makeIndexFromId),
        type: INDEX_DOCUMENT_TYPE,
        fields: fields,
        search_type: 'count',
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
              // http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html
              date_histogram: {
                field: 'timestamp',
                min_doc_count: 0,
                interval: dateRangeInterval.interval,
                extended_bounds: {
                  min: dateRangeInterval.start_ts,
                  max: dateRangeInterval.end_ts
                }
              },
              aggs: fields_aggs
            }
          }
        }
      }, function (err, res) {
        if (err) {
          return f(new PrettyError(500, 'Could not retrieve measurement, try again.', err));
        }

        //  buckets is an array of
        //  [{
        //   key_as_string: "2013-12-29T15:54:00.000Z",
        //   key: 1388332440000,
        //   doc_count: 1,
        //   {{fields[0]}}: { <-- first field name
        //     value: 3626992
        //   },
        //   ... <-- and so on for other fields
        // },
        // ...]
        //
        // We want to extract :
        // - `key`, and rename it to `timestamp`
        // - each fields along with their values

        var data = res.aggregations.volume.buckets.reduce(function (data, bucket) {
          var point = {
            timestamp: bucket.key
          };

          // add fields
          fields.forEach(function (fieldName) {
            point[fieldName] = bucket[fieldName].value;
          });

          data.push(point);
          return data;
        }, []);

        return f(null, data, res.took);
      });
    }
  };
};

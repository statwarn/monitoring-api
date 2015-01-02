'use strict';

// MeasurementRepository
module.exports = function (es, amqp, config, DateRangeInterval, MeasurementQuery) {
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

    /**
     * [findByIds description]
     * @param  {Array} ids array of time serie ids
     * @param  {Array} fields
     * @param  {Array} aggs array of aggregation type
     * @param  {DateRangeInterval} dateRangeInterval
     * @param  {Function} f(err: PrettyError, data: Array, took: Number)
     */
    findByIds: function (measurementQuery, f) {
      assert(measurementQuery instanceof MeasurementQuery);


      var query = measurementQuery.buildQuery(makeIndexFromId, INDEX_DOCUMENT_TYPE);

      es.search(query, function (err, res) {
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
          data.push(_.extend({
            timestamp: bucket.key
          }, _.pick(bucket, measurementQuery.fields)));
          return data;
        }, []);

        return f(null, data, res.took);
      });
    }
  };
};

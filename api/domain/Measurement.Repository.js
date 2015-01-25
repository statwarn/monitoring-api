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
          return f(new PrettyError(500, 'An error occured while creating the measurement', err));
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

      es.search(measurementQuery.buildQuery(makeIndexFromId, INDEX_DOCUMENT_TYPE), function (err, result) {
        if (err) {
          return f(new PrettyError(500, 'Could not retrieve measurement, try again.', err));
        }

        return f(null, measurementQuery.parseResults(result), result.took);
      });
    },

    describe: function (id, size, f) {
      es.search({
        index: makeIndexFromId(id),
        type: INDEX_DOCUMENT_TYPE,
        body: {
          size: size,
          sort: [{
            timestamp: {
              order: 'desc'
            }
          }]
        },
      }, function (err, res) {
        if (err || !res || !res.hits.hits) {
          return f(new PrettyError(500, 'Could not retrieve measurement, try again.', err));
        }
        // only get source.data of document
        var source = _(res.hits.hits)
          .pluck('_source')
          .pluck('data')
          .value();

        // merge measurements and replace value by key type
        var allKeys = _.mapValues(_.extend.apply(null, source), function (v, k) {
          // typeof [] === 'object'
          return _.isArray(v) ? 'array' : typeof v;
        });

        return f(null, allKeys);
      });
    }
  };
};

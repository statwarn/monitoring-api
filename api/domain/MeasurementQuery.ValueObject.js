'use strict';
/**
 * MeasurementQuery value
 */

module.exports = function (DateRangeInterval) {
  /**
   * Represent a measurement query
   * @param {Array} ids
   * @param {Array} fields
   * @param {Array} aggs
   * @param {DateRangeInterval} aggs
   * @private
   */
  function MeasurementQuery(ids, fields, aggs, dateRangeInterval) {
    this.ids = ids;
    this.fields = fields;
    this.aggs = aggs;
    this.range = dateRangeInterval;
  }

  MeasurementQuery.schema = require('./MeasurementQuery.ValueObject.schema');

  MeasurementQuery
  /**
   * Create a new MeasurementQuery object from a query
   * This factory will return a PrettyError if the data are invalid
   * @param  {Express req} req
   *                       req.start_ts (string) e.g. '1419872302441'
   *                       req.end_ts (string) e.g. '1419872392441'
   *                       req.interval must be a string from the `MeasurementQuery.INTERVALS` interval set
   * @return {PrettyError|MeasurementQuery}
   */
  MeasurementQuery.fromReq = function (req, dateRangeInterval) {
    if (!_.isObject(req) || !req || !_.isObject(req.query)) {
      return new PrettyError(400, 'Invalid request');
    }

    if (!(dateRangeInterval instanceof DateRangeInterval)) {
      return new PrettyError(400, 'Invalid Date range interval');
    }

    if (!req.query.id && !req.query.ids) {
      return new PrettyError('id or ids must be defined');
    }

    if (!req.query.field && !req.query.fields) {
      return new PrettyError('field or fields must be defined');
    }

    req.query.ids = convertToArray(req.query.id || req.query.ids);
    req.query.fields = convertToArray(req.query.field || req.query.fields);
    req.query.aggs = convertToArray(req.query.agg || req.query.aggs || _.first(MeasurementQuery.schema.AGGS));

    // complete aggs if necessary
    return _.validate(req.query, MeasurementQuery.schema.fromReq, function fallback(query) {
      return new MeasurementQuery(query.ids, query.fields, query.aggs, dateRangeInterval);
    });
  };

  return MeasurementQuery;
};

/////////////
// Helpers //
/////////////

function convertToArray(value) {
  if (_.isString(value)) {
    return [value];
  }

  if (_.isArray(value)) {
    return value;
  }

  // invalid value
  return [];
}

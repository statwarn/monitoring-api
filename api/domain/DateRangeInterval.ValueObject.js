'use strict';
var moment = require('moment-range');
/**
 * DateRangeInterval value
 */

module.exports = function () {
  /**
   * [DateRangeInterval description]
   * @param {Number} start_ts
   * @param {Number} end_ts
   * @param {String} interval
   */
  function DateRangeInterval(start_ts, end_ts, interval) {
    assert(_.isNumber(start_ts));
    assert(_.isNumber(end_ts));

    this.start_ts = start_ts;
    this.end_ts = end_ts;
    this.interval = interval;

    this._range = moment.range(start_ts, end_ts);
    this._interval = interval;
  }

  DateRangeInterval.schema = require('./DateRangeInterval.ValueObject.schema');

  /**
   * Create a new DateRangeInterval object from a query
   * This factory will return a PrettyError if the data are invalid
   * @param  {Express req} req
   *                       req.start_ts (string) e.g. '1419872302441'
   *                       req.end_ts (string) e.g. '1419872392441'
   *                       req.interval must be a string from the `DateRangeInterval.INTERVALS` interval set
   * @return {PrettyError|DateRangeInterval}
   */
  DateRangeInterval.fromReq = function (req) {
    if (!_.isObject(req) || !req || !_.isObject(req.query)) {
      return new PrettyError(400, 'Invalid request');
    }

    req.query.start_ts = parseInt(req.query.start_ts, 10);
    req.query.end_ts = parseInt(req.query.end_ts, 10);

    return _.validate(req.query, DateRangeInterval.schema.req, function fallback(query) {
      return new DateRangeInterval(query.start_ts, query.end_ts, query.interval);
    });
  };

  return DateRangeInterval;
};

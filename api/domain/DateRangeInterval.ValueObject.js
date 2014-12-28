'use strict';
var moment = require('moment-range');
/**
 * DateRangeInterval value
 */

module.exports = function (es, amqp, config) {
  /**
   * [DateRangeInterval description]
   * @param {Date} start_date
   * @param {Date} end_date
   * @param {String} interval
   */
  function DateRangeInterval(start_date, end_date, interval) {
    assert(_.isDate(start_date));
    assert(_.isDate(end_date));
    this._range = moment.range(start_date, end_date);
    this._interval = interval;
  }

  DateRangeInterval.schema = require('./DateRangeInterval.ValueObject.schema');

  /**
   * Create a new DateRangeInterval object from a query
   * This factory will return a PrettyError if the data are invalid
   * @param  {Express req} req
   *                       req.start_date must be in iso string format e.g. "2014-12-27T10:31:21.032Z"
   *                       req.end_date must be in iso string format e.g. "2014-12-27T10:31:21.032Z"
   *                       req.interval must be a string from the `DateRangeInterval.INTERVALS` interval set
   * @return {PrettyError|DateRangeInterval}
   */
  DateRangeInterval.fromReq = function (req) {
    if (!_.isObject(req) || !req || !_.isObject(req.query)) {
      return new PrettyError(400, 'Invalid req');
    }

    return _.validate(req.query, DateRangeInterval.schema.req, function fallback(query) {
      return new DateRangeInterval(new Date(req.query.start_date), new Date(req.query.end_date), req.query.interval);
    });
  };

  return DateRangeInterval;
};

'use strict';

/**
 * Measurement entity
 * @param {String} id
 * @param {Number} timestamp (timestamp in UTC)
 * @param {Object} data      pair of key/values
 * @param {Object|Null} metadata  pair of key/values
 */
function Measurement(id, timestamp, data, metadata) {
  assert(_.isString(id));
  assert(_.isNumber(timestamp));
  assert(_.isPlainObject(data));
  metadata && assert(_.isPlainObject(metadata));
  !metadata && assert(_.isNull(metadata));

  this.id = id;
  this.timestamp = timestamp;
  this.data = data;
  this.metadata = metadata;
}

Measurement.schema = require('./Measurement.Entity.schema');

/**
 * Create a new Measurement object from a JSON
 * This factory will return a PrettyError if data are invalid
 * @param  {Object}
 * @return {PrettyError|Measurement}
 */
Measurement.fromJSON = function (json) {
  if (!_.isObject(json) || !json) {
    return new PrettyError(400, 'Invalid JSON for Measurement');
  }

  return _.validate(json, Measurement.schema, function fallback(json) {
    return new Measurement(json.id, json.timestamp, json.data, json.metadata || null);
  });
};

module.exports = Measurement;

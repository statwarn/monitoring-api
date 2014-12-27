'use strict';

/**
 * Measurement entity
 * @param {String} id        an id that this measurement should be linked to
 * @param {String} timestamp String in ISO 8601 Extended Format
 * @param {Object} data      pair of key/values
 */
function Measurement(id, timestamp, data) {
  assert(_.isString(id));
  assert(_.isString(timestamp));
  assert(_.isPlainObject(data));

  this.id = id;
  this.timestamp = timestamp;
  this.data = data;
}

module.exports = Measurement;

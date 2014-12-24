'use strict';

/**
 * [InfoModel description]
 */
function Info(server_id, timestamp, metrics) {
  assert(_.isString(server_id));
  assert(_.isNumber(timestamp));
  assert(_.isPlainObject(metrics));

  this.server_id = server_id;
  this.timestamp = timestamp;
  this.metrics = metrics;
}

module.exports = Info;

'use strict';
var _           = require('lodash');

var PrettyError = require('../helpers/PrettyError');
var esClient    = null;
var amqp        = null;

/**
 * [InfoModel description]
 */
function InfoModel(server_id, timestamp, json) {
  this.server_id = server_id || null;
  this.timestamp = timestamp || new Date().getTime();
  this.metrics   = json      || {};
}

InfoModel.setDependencies = function(_esClient, _amqp)  {
  esClient = _esClient;
  amqp     = _amqp;
}

InfoModel.destroy = function(server_ids) {}

InfoModel.prototype.fromJSON = function(server_id, timestamp, json) {
  if (!_.isObject(json)) {
    return new PrettyError(500, 'fromJSON require an object', new Error(json));
  }

  if (!_.isString(server_id)  || server_id.length === 0) {
    return new PrettyError(400, 'server_id is not a string', new Error(json));
  }

  if (_.isNumber(timestamp)) {
    return new PrettyError(400, 'timestamp is not a number', new Error(json));
  }

  this.server_id = server_id;
  this.timestamp = timestamp;
  this.metrics   = json;

  return this;
}

InfoModel.prototype.create = function(f) {
  esClient.create({
    index: 'monitoring-' + this.server_id,
    type: 'info',
    body: this
  }, function(err, res) {
    if (err) {
      return f(new PrettyError(500, 'Could not create the info', err));
    }
    f(res);
  });
  // + amqp.publish..
}

module.exports = InfoModel;

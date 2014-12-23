'use strict';
var _ = require('lodash');
var async = require('async');

var PrettyError = require('../helpers/PrettyError');
var esClient = null;
var amqp = null;

/**
 * [InfoModel description]
 */
function InfoModel(server_id, timestamp, json) {
  this.server_id = server_id || null;
  this.timestamp = timestamp || new Date().getTime();
  this.metrics = json || {};
}

InfoModel.setDependencies = function (_esClient, _amqp)  {
  esClient = _esClient;
  amqp = _amqp;
};

InfoModel.toElasticField = function (field, text, f) {
  function iterator(field, cb) {
    return cb(null, text + field);
  }

  async.map(field.split(','), iterator, function (err, fields) {
    if (err) {
      new PrettyError(400, 'at least one ' + field + ' is invalid', err);
    }
    f(null, fields);
  });
};

// histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-histogram-aggregation.html
// date histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html
InfoModel.findByServerIds = function (server_ids, metrics, start, end, precision, f) {
  InfoModel.toElasticField(server_ids, 'monitoring', function (err, indices) {
    InfoModel.toElasticField(metrics, 'metrics.', function (err, metrics) {
      if (err) {
        return f(err);
      }
      esClient.search({
        indices: indices,
        type: 'info',
        fields: ['server_id', 'timestamp'].concat(metrics),
        body: {
          "aggs": {
            "volume": {
              "date_histogram": {
                "field": "timestamp",
                "min_doc_count": 0,
                "interval": precision,
                "extended_bounds": {
                  "min": new Date(start).getTime(),
                  "max": new Date(end).getTime()
                }
              }
            }
          }
        }
      }, function (err, res) {
        if (err) {
          return f(500, 'could not get the metrics', err)
        }
        InfoModel.toMetricsArray(res.hits.hits, function (err, metrics) {
          if (err) {
            return f(new PrettyError(500, 'cannot convert response to metrics', err));
          }
          return f(null, metrics);
        });
      });
    });
  });
};

InfoModel.toMetricsArray = function (res, f) {
  return f(null, res);
};

InfoModel.prototype.fromJSON = function (server_id, timestamp, json) {
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
  this.metrics = json;

  return this;
};

InfoModel.prototype.create = function (f) {
  esClient.create({
    index: 'monitoring-' + this.server_id,
    type: 'info',
    body: this
  }, function (err, res) {
    if (err) {
      return f(new PrettyError(500, 'could not create the info', err));
    }
    f(null, res);
  });
  amqp.exchanges['monitoring'].publish('#monitoring.new', this);
};

module.exports = InfoModel;

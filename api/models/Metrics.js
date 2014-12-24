'use strict';

// Repository
module.exports = function (es, amqp, PrettyError) {
  var Metric = require('./Metric');

  function toElasticField(field, text, f) {
    function iterator(field, cb) {
      return cb(null, text + field);
    }

    async.map(field.split(','), iterator, function (err, fields) {
      if (err) {
        return f(new PrettyError(400, 'at least one ' + field + ' is invalid', err));
      }
      f(null, fields);
    });
  }

  return {
    /**
     * Create a metric inside database
     * @param  {Metric} metric
     * @param  {Function} f(PrettyError, res)
     */
    create: function (metric, f) {
      assert(metric instanceof Metric);

      es.create({
        index: 'monitoring-' + metric.server_id,
        type: 'metric',
        body: metric
      }, function (err, res) {
        if (err) {
          return f(new PrettyError(500, 'could not create the metric', err));
        }
        f(null, res);
      });

      amqp.publish('monitoring', 'monitoring.new', this);
    },

    // histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-histogram-aggregation.html
    // date histogram aggregation: http://www.elasticsearch.com/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html
    findByServerIds: function (server_ids, metrics, start, end, precision, f) {
      toElasticField(server_ids, 'monitoring', function (err, indices) {
        toElasticField(metrics, 'metrics.', function (err, metrics) {
          if (err) {
            return f(err);
          }
          es.search({
            indices: indices,
            type: 'metric',
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
              return f(500, 'could not get the metrics', err);
            }

            // function (err, metrics) {
            //   if (err) {
            //     return f(new PrettyError(500, 'cannot convert response to metrics', err));
            //   }
            //   return f(null, res.hits.hits);
            // });
          });
        });
      });
    },

    fromJSON: function (server_id, timestamp, json) {
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
    }
  };
};

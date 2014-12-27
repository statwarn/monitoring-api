'use strict';

var elasticsearch = require('elasticsearch');

module.exports = function (esConfig) {
  /**
   * Connect to elasticsearch
   * @param  {Function} f(err, elasticsearchClient)
   */
  return function (f) {
    // http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/host-reference.html
    var es = new elasticsearch.Client({
      host: esConfig.host,
      log: esConfig.log,
      maxRetries: esConfig.maxRetries,
      requestTimeout: esConfig.requestTimeout,
      deadTimeout: esConfig.deadTimeout
    });

    // try to ping the ES instance to check if everything is fine
    es.ping({
      requestTimeout: esConfig.requestTimeout
    }, function (err) {
      // return both the error (if any) and the es client
      f(err, es);
    });
  };
};

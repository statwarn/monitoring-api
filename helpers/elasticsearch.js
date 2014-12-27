'use strict';

var elasticsearch = require('elasticsearch');

module.exports = function (esConfig) {
  // http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/host-reference.html
  return new elasticsearch.Client({
    host: esConfig.host,

    // String, String[], Object, Object[], Constructor — Unless a constructor is specified, this sets the output settings for the bundled logger. See the section on configuring-logging[logging] for more information.
    log: esConfig.log,

    // Integer — How many times should the client try to connect to other nodes before returning a ConnectionFault error.
    maxRetries: esConfig.maxRetries,

    // Number — Milliseconds before an HTTP request will be aborted and retried. This can also be set per request.
    requestTimeout: esConfig.requestTimeout,

    // Number — Milliseconds that a dead connection will wait before attempting to revive itself.
    deadTimeout: esConfig.deadTimeout
  });
};

'use strict';

var elasticsearch = require('elasticsearch');

module.exports = function (esConfig) {
  return new elasticsearch.Client({
    host: esConfig.host,
    log: esConfig.log
  });
};

'use strict';
var path = require('path');

module.exports = function (config) {
  assert(_.isString(config.elasticsearch.index.template));

  return {
    base: require('./monitoring.template'),
    defined: require(path.resolve(__dirname, config.elasticsearch.index.template))
  };
};

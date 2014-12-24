'use strict';

module.exports = function (models) {
  return {
    metrics: require('./metrics')(models)
  };
};

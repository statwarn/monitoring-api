'use strict';

module.exports = function (models) {
  return {
    measurements: require('./measurements')(models)
  };
};

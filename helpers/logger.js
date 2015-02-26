'use strict';
var Winston = require('winston');

var winston = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      colorize: true,
      timestamp: true
    })
  ],
  timestamp: true,
  level: 'debug'
});

module.exports = winston;

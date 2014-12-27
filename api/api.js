'use strict';

var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (config, logger, es, amqp, fOnError) {
  var domain = require('./domain')(es, amqp, config);
  var routes = require('./routes')(logger, es, amqp, fOnError, domain);

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // specify routes
  routes(app);

  return app;
};

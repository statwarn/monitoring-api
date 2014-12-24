'use strict';

var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (config, logger, es, amqp, fOnError) {
  var models = require('./models')(es, amqp, PrettyError);
  var routes = require('./routes')(models, logger, fOnError);

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // specify routes
  routes(app);

  return app;
};

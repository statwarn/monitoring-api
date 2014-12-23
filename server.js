'use strict';

var logger = require('./helpers/logger');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var config = require('./config')(logger);

var InfoModel = require('./models/InfoModel');

var PrettyError = require('./helpers/PrettyError');

var esClient = require('./helpers/elasticsearch')(config.elasticsearch);
var amqp = require('./helpers/amqp')(config.amqp);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

amqp({
  exchanges: ['monitoring']
}, function onConnect(err, amqp) {
  if (err) {
    throw new PrettyError(500, 'AMQP error', err);
  }

  logger.info('AMQP ready');

  require('./api/routes')(app, InfoModel, esClient, amqp, PrettyError);

  app.listen(config.api.port, function () {
    console.log('server started on ' + config.api.port);
  });
});

'use strict';

var http        = require('http');
var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();
var PORT        = process.env.PORT || 9000;

var config      = require('./config');
var InfoModel   = require('./models/InfoModel');

var PrettyError = require('./helpers/PrettyError');
var esClient    = require('./helpers/elasticsearch')(config.elasticsearch);
var amqp        = require('./helpers/amqp')(config.amqp);

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
  require('./api/routes')(app, InfoModel, esClient, amqp, PrettyError);
});


app.listen(PORT, function() {
  console.log('server started on ' + PORT);
});

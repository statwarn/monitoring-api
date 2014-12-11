'use strict';

var http          = require('http');
var express       = require('express');
var bodyParser    = require('body-parser');
var app           = express();
var PORT          = process.env.PORT || 9000;

var config        = require('./config');
var InfoModel     = require('./models/InfoModel');

var PrettyError   = require('./helpers/PrettyError');
var esClient      = require('./helpers/elasticsearch')(config.elasticsearch);
var amqp          = require('./helpers/amqp');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./api/routes')(app, InfoModel, esClient, amqp, PrettyError);

app.listen(PORT, function() {
  console.log('server started on ' + PORT);
});


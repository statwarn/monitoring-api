'use strict';
require('./bootstrap');

var logger = require('./helpers/logger');
var config = require('./config')(logger);
var es = require('./helpers/elasticsearch')(config.elasticsearch);
var amqp = require('./helpers/amqp')(config.amqp, logger);

// first connect to AMQP
amqp({}, function onConnected(err, amqp) {
  if (err) {
    logger.error(err);
    throw err;
  }

  logger.info('AMQP ready', config.amqp);

  // Then start the API
  var api = require('./api')(config, logger, es, amqp.connection, function onError(err, method, url) {
    // @todo track that into stathat & co
    logger.error(method + url, err);
  });

  api.listen(config.api.port, function () {
    logger.info('API listening on ' + config.api.port);
  });
});

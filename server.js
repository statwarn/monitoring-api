'use strict';
require('./bootstrap');

var logger = require('./helpers/logger');
var config = require('./config')(logger);
var es = require('./helpers/elasticsearch')(config.elasticsearch);
var amqp = require('./helpers/amqp')(config.amqp, logger);

function getConfiguredAPP(f, fRouteError) {
  // first connect to AMQP
  amqp({}, function onConnected(err, amqp) {
    if (err) {
      logger.error(err);
      throw err;
    }

    // configure the api
    var app = require('./api')(config, logger, es, amqp.connection, fRouteError);
    f(app, config, logger, es, amqp);
  });
}

function defaultAppHandler(app, config, logger, es, amqp) {
  app.listen(config.api.port, function () {
    logger.info('API listening on ' + config.api.port);
  });
}

function defaultRouteError(err, method, url) {
  // @todo track that into stathat & co
  logger.error(method + url, err);
}

if (module.parent === null) {
  // the server was directly launched
  getConfiguredAPP(defaultAppHandler, defaultRouteError);
} else {
  // otherwise the server was required by another module
  module.exports = getConfiguredAPP;
}

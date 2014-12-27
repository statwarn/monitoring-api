'use strict';
require('./bootstrap');

var logger = require('./helpers/logger');
var config = require('./config')(logger);
var connectAndCheckES = require('./helpers/elasticsearch')(config.elasticsearch);
var connectAndCheckAMQP = require('./helpers/amqp')(config.amqp, logger);

function getConfiguredAPP(f, fRouteError) {
  async.parallel({
    es: connectAndCheckES,
    amqp: connectAndCheckAMQP
  }, function (err, results) {
    if (err) {
      logger.error(err);
      throw err;
    }

    var es = results.es;
    var amqp = results.amqp;

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

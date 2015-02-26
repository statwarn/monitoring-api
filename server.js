'use strict';
require(!process.env.TEST ? './bootstrap' : './bootstrap.test');
var logger = require('./helpers/logger');
var config = require('./config')(logger);
var template = require('./template')(config);
/**
 
 * @param  {Function} f(app, config, logger, es, amqp)
 * @param  {Function} fRouteError(err, method, url)
 */
function getConfiguredAPP(f, fRouteError, options) {
  var connectAndCheckES = require('./helpers/elasticsearch')(config.elasticsearch);
  var connectAndCheckAMQP = require('./helpers/amqp')(config.amqp, logger, options);

  async.parallel({
    es: connectAndCheckES,
    amqp: _.partial(connectAndCheckAMQP)
  }, function (err, results) {
    if (err) {
      logger.error(err);
      throw err;
    }

    logger.info('AMQP & ES ready');

    var es = results.es;
    var amqp = results.amqp;

    amqp.connection.exchange(config.amqp.publish.exchange, {
      passive: true,
      confirm: true
    }, function (exchange) {
      amqp.publishExchange = exchange;
      // configure the api
      var app = require('./api')(config, logger, es, amqp, template, fRouteError);
      _.defer(f, app, config, logger, es, amqp);
    });
  });

}

function defaultAppHandler(app, config, logger /*, es, amqp */ ) {
  app.listen(config.statwarn.monitoring.api.port, function () {
    logger.info('API listening on ' + config.statwarn.monitoring.api.port);
  });
}

function defaultRouteError(err, method, url) {
  // @todo track that into stathat/starwarn & co
  logger.error(method + url, err);
}


if (module.parent === null) {
  // the server was directly launched
  getConfiguredAPP(defaultAppHandler, defaultRouteError, {
    amqpError: true
  });
} else {
  // otherwise the server was required by another module
  module.exports = getConfiguredAPP;
}

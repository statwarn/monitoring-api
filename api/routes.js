'use strict';

module.exports = function (models, logger, fOnError) {
  var augmentReqAndRes = require('./middlewares/augmentReqAndRes');
  var controllers = require('./controllers')(models);

  return function (app) {
    app.use(augmentReqAndRes(fOnError));

    app.post('/api/v1/metrics', controllers.metrics.post);
    app.get('/api/v1/metrics', controllers.metrics.get);
  };
};

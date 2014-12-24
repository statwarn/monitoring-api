'use strict';
var augment = require('./middlewares/augment');

module.exports = function (models, logger, fOnError) {
  var controllers = require('./controllers')(models);

  return function (app) {
    app.use(augment(fOnError));

    app.post('/api/v1/metrics', controllers.metrics.post);
    app.get('/api/v1/metrics', controllers.metrics.get);
  };
};

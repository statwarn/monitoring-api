'use strict';

module.exports = function (logger, es, amqp, fOnError, domain) {
  var augmentReqAndRes = require('./middlewares/augmentReqAndRes');
  var controllers = require('./controllers')(domain);

  return function (app) {
    app.use(augmentReqAndRes(fOnError));


    app.post('/api/v1/measurements', controllers.measurements.post);
    app.get('/api/v1/measurements', controllers.measurements.get);

    app.all('/internal/templates/setup', controllers.templates.setup);

    app.use(function errorHandler(err, req, res) {
      var publicError = new PrettyError(500, 'Internal Server Error', err);
      // clean stack because it does not say much
      publicError.stack = null;
      res.error(publicError);
    });
  };
};

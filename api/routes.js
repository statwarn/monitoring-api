/*jshint -W098 */
'use strict';

module.exports = function (logger, es, amqp, fOnError, domain) {
  var augmentReqAndRes = require('./middlewares/augmentReqAndRes');
  var controllers = require('./controllers')(domain);

  return function (app) {
    app.use(augmentReqAndRes(fOnError));

    app.get('/api/v1/measurements', controllers.measurements.get);

    // ensure that measurement id is well defined
    app.all('/api/v1/measurements/:measurement_id', controllers.measurements.middlewares);

    app.post('/api/v1/measurements/:measurement_id', controllers.measurements.post);
    app.get('/api/v1/measurements/:measurement_id/describe', controllers.measurements.describe);

    app.delete('/internal/removeAllData', controllers.measurements.removeAllData);
    app.all('/internal/templates/setup', controllers.templates.setup);

    app.use(function errorHandler(err, req, res, next) {
      var publicError = new PrettyError(500, 'Internal Server Error', err);
      // clean stack because it does not say much
      publicError.stack = null;
      res.status(500).send(publicError);
    });
  };
};

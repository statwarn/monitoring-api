'use strict';

module.exports = function (logger, es, amqp, fOnError, domain) {
  var augmentReqAndRes = require('./middlewares/augmentReqAndRes');
  var controllers = require('./controllers')(domain);

  return function (app) {
    app.use(augmentReqAndRes(fOnError));

    app.post('/api/v1/measurements', controllers.measurements.post);
    app.get('/api/v1/measurements', controllers.measurements.get);
  };
};

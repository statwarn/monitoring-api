'use strict';

module.exports = function(app, InfoModel, esClient, amqp, PrettyError) {

  function sendError(req, res, err) {
    res.json(err.code || 500, PrettyError.ErrorToJSON(err) || {});
  }

  InfoModel.setDependencies(esClient, amqp);

  function AuthMiddleware(req, res, next) {
    var access_token = req.params.access_token;
    next();
  }

  app.use('/api', AuthMiddleware);

  app.post('/api/v1/metrics', function(req, res) {
    var timestamp = req.query.timestamp;
    var server_id = req.query.server_id;

    var info = new InfoModel().fromJSON(server_id, timestamp, req.body);

    if (info instanceof PrettyError) {
      return sendError(req, res, info);
    }

    info.create(function(err, info) {
      if (err) {
        return sendError(req, res, err);
      }
      res.status(200).json(info);
    });
  });
}

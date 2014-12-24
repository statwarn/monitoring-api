'use strict';

module.exports = function (models) {
  return {
    get: function (req, res) {
      // @todo marge start, end & precision inside an object
      // rename start & end
      models.Infos.findByServerIds(
        req.query.server_ids,
        req.query.metrics,
        req.query.start,
        req.query.end,
        req.query.precision, function (err, metrics) {
          if (err) {
            return res.error(err);
          }

          return res.ok(metrics);
        });
    },

    // create a metric
    post: function (req, res) {
      var info = models.Infos.fromJSON(req.query.server_id, req.query.timestamp, req.body);

      if (info instanceof PrettyError) {
        return res.error(info);
      }

      models.Infos.create(info, function (err, info) {
        if (err) {
          return res.error(err);
        }

        res.ok(info);
      });
    }
  };
};

'use strict';

module.exports = function (models) {
  return {
    get: function (req, res) {
      // @todo marge start, end & precision inside an object
      // rename start & end
      var interval = models.IntervalPrecision.fromReq(req);

      if (interval instanceof PrettyError) {
        return res.error(interval);
      }

      // @todo check that server_ids is an array of string (or a string -> convert it to an array)
      // @todo check that server_ids is an array of string (or a string -> convert it to an array)

      models.Metrics.findByServerIds(
        req.query.server_ids,
        req.query.metrics,
        interval,
        res.errorOrValue);
    },

    // create a metric
    post: function (req, res) {
      var info = models.Infos.fromJSON(req.query.server_id, req.query.timestamp, req.body);

      if (info instanceof PrettyError) {
        return res.error(info);
      }

      models.Metrics.create(info, function (err, info) {
        if (err) {
          return res.error(err);
        }

        res.ok(info);
      });
    }
  };
};

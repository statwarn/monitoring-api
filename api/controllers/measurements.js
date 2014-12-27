'use strict';

module.exports = function (models) {
  return {
    // create a measurement
    post: function (req, res) {
      var info = models.Measurements.fromJSON(req.query.server_id, req.query.timestamp, req.body);

      if (info instanceof PrettyError) {
        return res.error(info);
      }

      models.Metrics.create(info, function (err, info) {
        if (err) {
          return res.error(err);
        }

        res.ok(info);
      });
    },

    // retrieve one (or more) measurements from a id
    get: function (req, res) {
      // @todo marge start, end & precision inside an object
      // rename start & end
      var interval = models.DateRangeInterval.fromReq(req);

      if (interval instanceof PrettyError) {
        return res.error(interval);
      }



      // @todo check that id is an array of string (or a string -> convert it to an array)
      // @todo check that id is an array of string (or a string -> convert it to an array)

      models.Metrics.findByServerIds(
        req.query.id,
        req.query.metrics,
        interval,
        res.errorOrValue);
    },

  };
};

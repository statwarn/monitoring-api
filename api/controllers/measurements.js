'use strict';

module.exports = function (domain) {
  return {
    // create a measurement
    post: function (req, res) {
      var measurement = domain.Measurement.fromJSON(req.body);

      if (measurement instanceof PrettyError) {
        return res.error(measurement);
      }

      domain.Measurements.create(measurement, function (err) {
        if (err) {
          return res.error(err);
        }
        res.status(201).end();
      });
    },

    // retrieve one (or more) measurements from a id
    get: function (req, res) {
      var interval = domain.DateRangeInterval.fromReq(req);

      if (interval instanceof PrettyError) {
        return res.error(interval);
      }

      // @todo check that id is an array of string (or a string -> convert it to an array)
      // @todo check that id is an array of string (or a string -> convert it to an array)
      domain.Measurements.findByIds(
        req.query.id,
        req.query.metrics,
        interval,
        res.errorOrValue);
    },

  };
};

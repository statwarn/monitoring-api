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
      var dateRangeInterval = domain.DateRangeInterval.fromReq(req);
      if (dateRangeInterval instanceof PrettyError) {
        return res.error(dateRangeInterval);
      }

      var measurementQuery = domain.MeasurementQuery.fromReq(req, dateRangeInterval);
      if (measurementQuery instanceof PrettyError) {
        return res.error(measurementQuery);
      }

      domain.Measurements.findByIds(measurementQuery, function (err, data, took) {
        if (err) {
          return res.error(err);
        }

        res.set('x-took', took);
        res.ok(data);
      });
    },

  };
};

'use strict';

module.exports = function (domain) {
  return {
    // create a measurement
    post: function (req, res) {
      var measurement_id = req.params.measurement_id;
      var measurement = domain.Measurement.fromJSON(measurement_id, req.body);

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

    // get data keys of X latest documents
    describe: function (req, res) {
      if (!_.isObject(req) || !req || !_.isObject(req.params)) {
        return res.error(new PrettyError(400, 'Invalid request'));
      }

      if (size && !_.isNumber(parseInt(size, 10))) {
        return res.error(new PrettyError(400, 'size must be a number'));
      }

      var id = req.params.measurement_id;
      var size = size ? parseInt(req.params.size, 10) :  10;

      domain.Measurements.describe(id, size, function (err, data) {
        if (err) {
          return res.error(err);
        }
        res.ok(data);
      });
    },

    removeAllData: function (req, res) {
      if (!_.isObject(req) || !req || !_.isObject(req.params)) {
        return res.error(new PrettyError(400, 'Invalid request'));
      }

      var before_date = req.params.remove_before_date;

      if (!before_date || !_.isNumber(parseInt(before_date, 10))) {
        return res.error(new PrettyError(400, 'before_date must be defined and a timestamp'));
      }

      domain.Measurements.removeAllData(before_date, function (err) {
        if (err) {
          return res.error(err);
        }
        res.status(201).end();
      });
    },

    // Define middlewares
    middlewares: [

      function checkMeasurementId(req, res, next) {
        if (!req.params || !req.params.measurement_id || !_.isString(req.params.measurement_id) || req.params.measurement_id.length === 0) {
          return res.error(new PrettyError(400, 'measurement_id must be defined and a non-empty string'));
        }

        next();
    }]
  };
};

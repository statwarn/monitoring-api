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

      if (!req.query.id && !req.query.ids) {
        return res.error(new PrettyError('id or ids must be defined'));
      }

      if (!req.query.field && !req.query.fields) {
        return res.error(new PrettyError('field or fields must be defined'));
      }

      var ids = convertToArray(req.query.id || req.query.ids);
      var fields = convertToArray(req.query.field || req.query.fields);

      domain.Measurements.findByIds(
        ids,
        fields,
        dateRangeInterval,
        res.errorOrValue);
    },

  };
};


function convertToArray(value) {
  if (_.isString(value)) {
    return [value];
  }

  if (_.isArray(value)) {
    return value;
  }

  // invalid value
  return [];
}

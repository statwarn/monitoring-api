'use strict';

var tv4 = require('tv4');
tv4.addFormat(require('tv4-formats'));
tv4.addFormat({
  'enum': function (value, params) {
    assert(_.isArray(params.values));
    return _.contains(params.values, value) ? null : '' + params.title + ' should be one of the following values ' + params.values.join(', ');
  }
});
/**
 * this method is synchronous
 * @param  {Mixed} data
 * @param  {Object} schema   json schema
 * @param  {Function} fallback(data) -> b
 * @return {Mixed} either a PrettyError or the data
 */
function validate(data, schema, fallback) {
  var err = tv4.validateMultiple(data, schema);
  if (!err || _.isObject(err) && err.valid) {
    // no error were found, continue
    return _.isFunction(fallback) ? fallback(data) : err;
  }

  return PrettyError.fromValidation(err);
}

module.exports = {
  validate: validate
};

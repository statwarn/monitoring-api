'use strict';

/**
 * [exports description]
 * @param  {Function} onError(err)
 */
module.exports = function (onError) {
  return function (req, res, next) {

    req.p = function (param) {
      return req.params[param] || req.param(param);
    };

    req.resOrValue = function (err, value) {
      if (err) {
        return res.error(err);
      }

      return res.ok(value);
    };

    // For express 3.x res.json(code, json);
    /**
     * [error description]
     *
     * Usage:
     *  res.error(new PrettyError(500, '', err));
     *  res.error(401, new PrettyError(500, '', err));
     *
     * @param  {Number} code
     * @param  {PrettyError} error
     */
    res.error = function (code, error) {
      if (code instanceof PrettyError) {
        error = code;
        code = error.code || 500;
      }

      onError(error, req.method, req.url, req);
      return res.status(code).json(PrettyError.ErrorToJSON(error) || {});
    };

    res.ok = function (jsonOrError, code) {
      return res.status(code || 200).json(jsonOrError);
    };

    next();
  };
};

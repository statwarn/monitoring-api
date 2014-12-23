'use strict';
var IS_PROD = process.env.NODE_ENV === "production";

function PrettyError(code, message, cause) {
  this.message = message;
  this.code = code;
  this.stack = _cleanStack(new Error().stack);
  this.cause = cause || null;
}

function _cleanStack(stack) {

  return stack
    .split('\n')
    .map(function (line) {
      return line.trim();
    })
    .filter(function (line) {
      return line.indexOf('new PrettyError') === -1;
    });
}

function ErrorToJSON(err) {
  if (err instanceof Error) {
    return {
      message: err.message,
      stack: _cleanStack(err.stack)
    };
  }

  if (err instanceof PrettyError) {
    return err.toJSON();
  }

  return err ? err.toString() : null;
}

PrettyError.ErrorToJSON = ErrorToJSON;

PrettyError.prototype.toJSON = function () {
  var o = {
    code: this.code,
    message: this.message
  };

  if (!IS_PROD) {
    o.stack = this.stack;
    o.cause = ErrorToJSON(this.cause);
  }

  return o;
};

PrettyError.prototype.toError = function () {
  var err = new Error(this.message);
  err.code = this.code;
  err.stack = this.stack;
  return err;
};

module.exports = PrettyError;

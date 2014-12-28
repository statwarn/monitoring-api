'use strict';

module.exports = function (domain) {
  return {
    // setup a template
    setup: function (req, res) {
      domain.Template.setupTemplate(req.resOrValue);
    }
  };
};

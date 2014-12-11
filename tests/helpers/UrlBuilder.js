function UrlBuilder(conf) {
  this.protocol = conf.protocol || 'http://';
  this.host     = conf.host ||  'localhost';
  this.port     = process.env.PORT || 9000;
  this.address  = conf.address || '';
  this.params   = conf.params || '';
}

UrlBuilder.prototype.build = function()  {
  return encodeURI([
    this.protocol,
    this.host,
    ':'+this.port,
    this.address,
    this.buildParams()
  ].join(''));
}

UrlBuilder.prototype.buildParams = function() {
  var params = '?';
  for (var i in this.params) {
    params += [i, '=', this.params[i], '&'].join('');
  }
  return params.substring(0, params.length - 1);
}

module.exports = UrlBuilder;

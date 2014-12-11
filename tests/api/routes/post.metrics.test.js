'use strict';

var request    = require('request');
var t          = require('chai').assert;

var UrlBuilder = require('../../helpers/UrlBuilder');
var InfoModel  = require('../../../models/InfoModel');
var redisInfo  = require('../../fixtures/redisInfo');

var server_id  = process.env.SERVER_ID || '507971fab849097c10000065';
var timestamp  = 1418297345864;
var port       = 9000;

var url        = new UrlBuilder({
  address: '/api/v1/metrics',
  port: port,
  params: {
    server_id: server_id,
    timestamp: timestamp
  }
}).build();

console.log('url:', url);

describe('POST /metrics endpoint', function() {
  beforeEach(function(done) {
    done();
  });
  afterEach(function(done) {
    done();
  });

  it('should post a metric', function(done) {
    request.post(url, function(err, res, body) {
      t.strictEqual(err, null);
      done();
    });
  });
});

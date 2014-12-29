'use strict';
require('../bootstrap');
var RAW_DATA = require('./data.json');

var logger = require('../helpers/logger');
var config = require('../config')(logger);
var request = require('requestretry');
var flatten = require('flat');

var data = RAW_DATA.map(function (obj) {
  // remove data we don't need
  // we will generate an id and a ts automatically
  var cleanObject = _.omit(obj, '_id', '_serverId', 'ts');
  return flatten(cleanObject);
});

var ONE_YEAR = 365 * 24 * 3600 * 1000;

var CONCURRENCY = 20;
var NUM_REQUEST = 1000;
var NUM_UUID = 4;
var UUIDS = _.range(1, NUM_UUID).map(generateUUID);

// prepare
console.log('precomputing requests');
var ids = _.range(1, NUM_REQUEST).map(function (i) {
  return [i, {
    id: _.sample(UUIDS),
    timestamp: +new Date() - ONE_YEAR + i * 60 * 1000,
    data: _.sample(data)
  }];
});
console.log('ready');

console.time('Benchmark total');
async.eachLimit(ids, CONCURRENCY, sendData, function () {
  console.timeEnd('Benchmark total');
});


function sendData(pair, f) {
  var i = pair[0];
  var body = pair[1];
  var TIME = i + ' ' + body.id + '-' + body.timestamp;
  console.time(TIME);
  // console.log(JSON.stringify(body, null, 2));
  // return;

  request({
    url: 'http://localhost:' + config.api.port + '/api/v1/measurements',
    method: 'POST',
    json: true,
    body: body,
    maxAttempts: 1,
    retryDelay: 5000,
    retryStrategy: request.RetryStrategies.NetworkError
  }, function (err, resp, body) {
    console.timeEnd(TIME);
    f(err);
  });
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

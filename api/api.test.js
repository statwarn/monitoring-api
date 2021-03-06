'use strict';
// https://github.com/tj/supertest/blob/master/test/supertest.js
require('../bootstrap.test');
var app, es, amqp;

describe('Monitoring API server', function () {
  beforeEach(function (done) {
    t.getAPP(function (_app, config, logger, _es, _amqp) {
      app = _app;
      es = _es;
      amqp = _amqp;
      done();
    });
  });

  describe('POST /api/v1/measurements', function () {
    it('should return a 400 error if nothing was passed in body', function (done) {
      request(app)
        .post('/api/v1/measurements/my-time-serie')
        .expect(400)
        .end(done);
    });

    it('should return a 201 when a valid measurements is passed in body', function (done) {
      request(app)
        .post('/api/v1/measurements/my-time-serie')
        .send({
          timestamp: Date.now(),
          data: {
            a: Math.round(Math.random() * 10),
            'float': 1.234,
            'floats': "1.234",
            b: 'plop'
          }
        })
        .expect(201)
        .end(done);
    });
  });
});

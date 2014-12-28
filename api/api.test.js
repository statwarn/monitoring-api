'use strict';

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
        .post('/api/v1/measurements')
        .expect(400)
        .end(done);
    });

    it('should return a 201 when a valid measurements is passed in body', function (done) {
      request(app)
        .post('/api/v1/measurements')
        .send({
          // specify the time-serie id
          id: 'my-time-serie',
          timestamp: Date.now(),
          data: {
            a: Math.round(Math.random() * 10),
            b: 'plop'
          }
        })
        .expect(201)
        .end(done);
    });
  });

  describe('GET /api/v1/measurements', function () {
    // https://redsmintest.west-eu.azr.facetflow.io/monitoring-testid/measurement/_search?size=10&from=0
    // https://redsmintest.west-eu.azr.facetflow.io/monitoring-testid/_mapping
  });
});

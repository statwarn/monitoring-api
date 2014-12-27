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
          id: 'plop',
          timestamp: +new Date(),
          data: {
            a: 1,
            b: 2
          }
        })
        .expect(201)
        .end(done);
    });
  });
});

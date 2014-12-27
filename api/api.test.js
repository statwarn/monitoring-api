require('../bootstrap.test');
var app;

describe('Monitoring API server', function () {
  beforeEach(function (done) {
    t.getAPP(function (_app) {
      app = _app;
      done();
    });
  });

  describe('POST /api/v1/measurements', function () {
    it('should return an error if nothing was passed in body', function (done) {
      request(app)
        .post('/api/v1/measurements')
        .expect(500)
        .end(done);
    });
  });
});

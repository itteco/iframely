'use strict';

var request = require('supertest');
var ServerMock = require('mock-http-server');
var chai = require('chai');
var async = require('async');

describe('meta endpoint', function() {

  var BASE_IFRAMELY_SERVER_URL = 'http://localhost:' + process.env.PORT;

  var TARGET_MOCKED_SERVER_PORT = 9000;
  var TARGET_MOCKED_SERVER_BASEURL = 'http://127.0.0.1:' + TARGET_MOCKED_SERVER_PORT;

  var targetMockedServer = new ServerMock({ host: 'localhost', port: TARGET_MOCKED_SERVER_PORT });
  var server;

  beforeEach(function(done) {
    var app = require('../app');
    server = app.listen(process.env.PORT, function() {
      targetMockedServer.start(done);
    });
  });

  afterEach(function(done) {
    server.close(function() {
      targetMockedServer.stop(done);
    });
  });

  it('should return a valid response for a valid url', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/testok',
      reply: {
        status:  200,
        headers: { 'content-type': 'text/html' },
        body: "<html><body>Hi there!</body></html>"
      }
    });

    var url = TARGET_MOCKED_SERVER_BASEURL + '/testok';
    request(BASE_IFRAMELY_SERVER_URL)
        .get('/iframely?url=' + url)
        .end(function(err, res) {
          chai.expect(res.body.meta).to.exist;
          done(err);
        });
  });

  it('should handle 404 responses in target urls', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/test404',
      reply: {
        status:  404
      }
    });

    var url = TARGET_MOCKED_SERVER_BASEURL + '/test404';
    request(BASE_IFRAMELY_SERVER_URL)
        .get('/iframely?url=' + url)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(404);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 404,
              message: 'Page not found'
            }
          });
          done(err);
        });
  });

  it('should handle 500 responses in target urls', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/test500',
      reply: {
        status: 500
      }
    });

    var url = TARGET_MOCKED_SERVER_BASEURL + '/test500';
    request(BASE_IFRAMELY_SERVER_URL)
        .get('/iframely?url=' + url)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(417);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 417,
              message: 'Requested page error: 500'
            }
          });
          done(err);
        });
  });

  it('should handle 401 responses from target servers', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/test401',
      reply: {
        status: 401
      }
    });

    var url = TARGET_MOCKED_SERVER_BASEURL + '/test401';
    request(BASE_IFRAMELY_SERVER_URL)
        .get('/iframely?url=' + url)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(401);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 401,
              message: 'Unauthorized'
            }
          });
          done(err);
        });
  });

  it('should handle 403 responses from target servers', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/test403',
      reply: {
        status: 403
      }
    });

    var url = TARGET_MOCKED_SERVER_BASEURL + '/test403';
    request(BASE_IFRAMELY_SERVER_URL)
        .get('/iframely?url=' + url)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(403);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 403,
              message: 'Forbidden'
            }
          });
          done(err);
        });
  });

  it('should handle timeouts from target servers', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/test-timeout',
      reply: {
        body: function(req, reply) {
          setTimeout(function(){
            reply('ok');
          }, 1000); // higher than RESPONSE_TIMEOUT defined in config.test.js, so request will timeout
        }
      }
    });

    var url = TARGET_MOCKED_SERVER_BASEURL + '/test-timeout';
    request(BASE_IFRAMELY_SERVER_URL)
        .get('/iframely?url=' + url)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(408);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 408,
              message: 'Timeout'
            }
          });
          done(err);
        });
  });

  it('should handle blacklisted domains', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/test-timeout',
      reply: {
        status:  200,
        headers: { 'content-type': 'text/html' },
        body: "<html><body>Hi there!</body></html>"
      }
    });

    var url = 'http://blacklisted.com/test-timeout';
    request(BASE_IFRAMELY_SERVER_URL)
        .get('/iframely?url=' + url)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(417);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 417,
              message: 'Requested page error: 417',
              messages: [
                "This domain is flagged as inappropriate."
              ]
            }
          });
          done(err);
        });
  });

  // https://github.com/itteco/iframely/issues/141
  it('should maintain format on cached error responses', function(done) {
    targetMockedServer.on({
      method: 'GET',
      path: '/test403',
      reply: {
        status: 403
      }
    });

    var url = 'http://127.0.0.1:9000/test403';
    var endpoint = '/iframely?url=' + url;

    function runExpectations(res) {
      chai.expect(res.statusCode).to.equal(403);
      chai.expect(res.body).to.deep.equal({
        error: {
          source: 'iframely',
          code: 403,
          message: 'Forbidden'
        }
      });
    }

    function issueRequest (cb) {
      request(BASE_IFRAMELY_SERVER_URL)
          .get(endpoint)
          .end(function(err, res) {
            runExpectations(res);
            cb(err);
          });
    }

    //hit twice the same endpoint with error
    async.series([issueRequest,issueRequest], done);

  });

});

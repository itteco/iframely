'use strict';

const request = require('supertest');
const ServerMock = require("mock-http-server");
const chai = require('chai');

describe('meta endpoint', () => {

  const BASE_IFRAMELY_SERVER_URL = `http://localhost:${process.env.PORT}`;
  const server = require('../server'); // start card meta

  const TARGET_MOCKED_SERVER_PORT = 9000;
  const targetMockedServer = new ServerMock({ host: "localhost", port: TARGET_MOCKED_SERVER_PORT });

  beforeEach(function(done) {
    targetMockedServer.start(done);
  });

  afterEach(function(done) {
    targetMockedServer.stop(done);
  });

  it('should return a valid response for a valid url', done => {
    targetMockedServer.on({
      method: 'GET',
      path: '/testok',
      reply: {
        status:  200,
        headers: { "content-type": "text/html" },
        body: "<html><body>Hi there!</body></html>"
      }
    });

    const url = `http://127.0.0.1:${TARGET_MOCKED_SERVER_PORT}/testok`;
    request(BASE_IFRAMELY_SERVER_URL)
        .get(`/iframely?url=${url}`)
        .end(function(err, res) {
          chai.expect(res.body.meta).to.exist;
          done(err);
        });
  });

  it('should handle 404 responses in target urls', done => {
    targetMockedServer.on({
      method: 'GET',
      path: '/test404',
      reply: {
        status:  404
      }
    });

    const url = `http://127.0.0.1:${TARGET_MOCKED_SERVER_PORT}/test404`;
    request(BASE_IFRAMELY_SERVER_URL)
        .get(`/iframely?url=${url}`)
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

  it('should handle 500 responses in target urls', done => {
    targetMockedServer.on({
      method: 'GET',
      path: '/test500',
      reply: {
        status: 500
      }
    });

    const url = `http://127.0.0.1:${TARGET_MOCKED_SERVER_PORT}/test500`;
    request(BASE_IFRAMELY_SERVER_URL)
        .get(`/iframely?url=${url}`)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(500);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 500,
              message: 'Server error'
            }
          });
          done(err);
        });
  });

  it('should handle 401 responses from target servers', done => {
    targetMockedServer.on({
      method: 'GET',
      path: '/test401',
      reply: {
        status: 401
      }
    });

    const url = `http://127.0.0.1:${TARGET_MOCKED_SERVER_PORT}/test401`;
    request(BASE_IFRAMELY_SERVER_URL)
        .get(`/iframely?url=${url}`)
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

  it('should handle 403 responses from target servers', done => {
    targetMockedServer.on({
      method: 'GET',
      path: '/test403',
      reply: {
        status: 403
      }
    });

    const url = `http://127.0.0.1:${TARGET_MOCKED_SERVER_PORT}/test403`;
    request(BASE_IFRAMELY_SERVER_URL)
        .get(`/iframely?url=${url}`)
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

    const url = `http://127.0.0.1:${TARGET_MOCKED_SERVER_PORT}/test-timeout`;
    request(BASE_IFRAMELY_SERVER_URL)
        .get(`/iframely?url=${url}`)
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
        headers: { "content-type": "text/html" },
        body: "<html><body>Hi there!</body></html>"
      }
    });

    const url = `http://blacklisted.com/test-timeout`;
    request(BASE_IFRAMELY_SERVER_URL)
        .get(`/iframely?url=${url}`)
        .end(function(err, res) {
          chai.expect(res.statusCode).to.equal(410);
          chai.expect(res.body).to.deep.equal({
            error: {
              source: 'iframely',
              code: 410,
              message: 'Blacklisted'
            }
          });
          done(err);
        });
  });

});
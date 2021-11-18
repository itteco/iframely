'use strict';
import * as request from 'supertest';
import * as ServerMock from 'mock-http-server';
import * as chai from 'chai';
import * as async from 'async';

var server;

var ENV_WITH_CUSTOM_PLUGINS = 'test_with_custom_plugins';

function invalidateRequireCache () {
  Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })
}

var startWithENV = function (env, cb) {
  process.env.NODE_ENV = env;
import * as app from '../app.js';
  server = app.listen(process.env.PORT, cb);
};

describe('custom plugins', function() {
  var BASE_IFRAMELY_SERVER_URL = 'http://localhost:' + process.env.PORT;

  var TARGET_MOCKED_SERVER_PORT = 9000;
  var TARGET_MOCKED_SERVER_BASEURL = 'http://127.0.0.1:' + TARGET_MOCKED_SERVER_PORT;

  var targetMockedServer = new ServerMock({ host: 'localhost', port: TARGET_MOCKED_SERVER_PORT });

  beforeEach(function(done) {
    invalidateRequireCache();
    targetMockedServer.start(done);
  });

  afterEach(function(done) {
    server.close(function() {
      targetMockedServer.stop(done);
    });
  });

  it('should use a custom plugin if defined', function(done) {
    startWithENV(ENV_WITH_CUSTOM_PLUGINS, function () {
      targetMockedServer.on({
        method: 'GET',
        path: '/testok',
        reply: {
          status:  200,
          headers: { 'content-type': 'text/html' },
          body: "<html><title>my title</title><meta name='description' content='my description'><body>Hi there!</body></html>"
        }
      });

      var url = TARGET_MOCKED_SERVER_BASEURL + '/testok';
      request(BASE_IFRAMELY_SERVER_URL)
          .get('/iframely?url=' + url)
          .end(function(err, res) {
            chai.expect(res.body.meta.description).to.equal('custom description for test.com domain');
            done(err);
          });
    });
  });

  //it('should use a core plugin if no custom plugin exists', function(done) {
  //  startWithENV('test', function () {
  //    targetMockedServer.on({
  //      method: 'GET',
  //      path: '/testok',
  //      reply: {
  //        status:  200,
  //        headers: { 'content-type': 'text/html' },
  //        body: "<html><title>my title</title><meta name='description' content='my description'><body>Hi there!</body></html>"
  //      }
  //    });
  //
  //    var url = TARGET_MOCKED_SERVER_BASEURL + '/testok';
  //    request(BASE_IFRAMELY_SERVER_URL)
  //        .get('/iframely?url=' + url)
  //        .end(function(err, res) {
  //          chai.expect(res.body.meta.title).to.equal('my title');
  //          done(err);
  //        });
  //  });
  //});

  it('should use a custom plugin overriding a core plugin ', function(done) {
    startWithENV(ENV_WITH_CUSTOM_PLUGINS, function () {
      targetMockedServer.on({
        method: 'GET',
        path: '/testok',
        reply: {
          status:  200,
          headers: { 'content-type': 'text/html' },
          body: "<html><title>my title</title><meta name='description' content='my description'><body>Hi there!</body></html>"
        }
      });

      var url = TARGET_MOCKED_SERVER_BASEURL + '/testok';
      request(BASE_IFRAMELY_SERVER_URL)
          .get('/iframely?url=' + url)
          .end(function(err, res) {
            chai.expect(res.body.meta.title).to.equal('TITLE FROM CUSTOM-PLUGIN');
            done(err);
          });
    });
  });
});

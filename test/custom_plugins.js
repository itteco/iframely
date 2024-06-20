'use strict';
import request from 'supertest';
import ServerMock from 'mock-http-server';
import chai from 'chai';
import app from '../app.js';

describe('custom plugins', function() {

  var BASE_IFRAMELY_SERVER_URL = 'http://localhost:' + process.env.PORT;

  var TARGET_MOCKED_SERVER_PORT = 9000;
  var TARGET_MOCKED_SERVER_BASEURL = 'http://127.0.0.1:' + TARGET_MOCKED_SERVER_PORT;

  var targetMockedServer = new ServerMock({ host: '127.0.0.1', port: TARGET_MOCKED_SERVER_PORT });
  var server;

  beforeEach(function(done) {
    server = app.listen(process.env.PORT, function() {
      targetMockedServer.start(done);
    });
  });

  afterEach(function(done) {
    server.close(function() {
      targetMockedServer.stop(done);
    });
  });

  it('should use a custom plugin if defined', function(done) {
    
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

  it('should use a core plugin if no custom plugin exists', function(done) {
   
     targetMockedServer.on({
       method: 'GET',
       path: '/test-another',
       reply: {
         status:  200,
         headers: { 'content-type': 'text/html' },
         body: "<html><title>my title</title><meta name='description' content='my description'><body>Hi there!</body></html>"
       }
     });
  
     var url = TARGET_MOCKED_SERVER_BASEURL + '/test-another';
     request(BASE_IFRAMELY_SERVER_URL)
         .get('/iframely?url=' + url)
         .end(function(err, res) {
           chai.expect(res.body.meta.description).to.equal('my description');
           done(err);
         });
  });

  it('should use a custom plugin overriding a core plugin ', function(done) {
    
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

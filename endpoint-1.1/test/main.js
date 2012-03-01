(function() {

var assert = require('assert');
var events = require('events');
var request = require('request');
var vows = require('vows');

var iframely = require('../../iframely-node');

var api = {
    oembed: function(url, options) {
        return function() {
            iframely.getOembedByProvider(url, options, this.callback);
        }
    }
}

vows.describe('Tests')
.addBatch({
    'Support CORS': {
        topic: api.oembed('http://iframe.ly/oembed/1?url=http://provider.iframe.ly/video/', {}),
        'is valid': function(error, res) {
            assert.isNull(error);
            assert.instanceOf(res, events.EventEmitter);
        },
        'is CORS': function(error, res) {
            assert.isObject(res.headers);
            assert.isString(res.headers['access-control-allow-origin']);
        }
    },
    'Get oembed as json': {
        topic: api.oembed('http://iframe.ly/oembed/1?url=http://provider.iframe.ly/video/&format=json', {type: 'string'}),
        'is json': function(error, res) {
            assert.isNull(error);
            assert.isString(res);
            assert.doesNotThrow(function() {JSON.parse(res);});
        }
    },
    'Get oembed as xml': {
        topic: api.oembed('http://iframe.ly/oembed/1?url=http://provider.iframe.ly/video/&format=xml', {type: 'string'}),
        'is xml': function(error, res) {
            assert.isNull(error);
            assert.isString(res);
            assert.match(res, /<\?xml\s/);
        }
    },
    'Get oembed with iframe': {
        topic: api.oembed('http://iframe.ly/oembed/1?url=http://provider.iframe.ly/video/&format=json&iframe=true', {type: 'object'}),
        'is iframed': function(error, res) {
            assert.isNull(error);
            assert.isObject(res);
            assert.isString(res.html);
            assert.equal(res.html, '<iframe src="http://iframe.ly/iframe/1?url=http%3A%2F%2Fprovider.iframe.ly%2Foembed%3Furl%3Dhttp%3A%2F%2Fprovider.iframe.ly%2Fvideo%2F"></iframe>')
        }
    },
    "Get iframe": {
        topic: function() {
            request('http://iframe.ly/iframe/1?url=http%3A%2F%2Fprovider.iframe.ly%2Foembed%3Furl%3Dhttp%3A%2F%2Fprovider.iframe.ly%2Fvideo%2F', this.callback);
        },
        'is valid': function(error, res, data) {
            
            assert.isNull(error);
            assert.isObject(res);
            assert.equal(res.statusCode, 200);
            assert.equal(res.headers['content-type'], 'text/html');
            assert.isString(data);
        }
    }
    
})['export'](module);
    
})();

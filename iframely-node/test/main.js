(function() {

var assert = require('assert');
var events = require('events');
var vows = require('vows');

var iframely = require('../iframely.js');

vows.describe('Tests')
.addBatch({
    'Get oEmbed Links': {
        topic: function() {
            iframely.getOembedLinks('http://provider.iframe.ly/video/', this.callback);
        },
        'is array': function(err, links) {
            assert.isNull(err);
            assert.isArray(links);
        },
        'is not empty': function(err, links) {
            assert.isNotZero(links.length);
        },
        'is valid': function(err, links) {
            links.forEach(function(link) {
                assert.isObject(link);
                assert.isString(link.href);
                assert.match(link.href, /^https?:\/\//);
                assert.isString(link.rel);
                assert.isString(link.type);
            });
        }
    },
    'Get oEmbed Links without cache': {
        topic: function() {
            iframely.getOembedLinks('http://provider.iframe.ly/video/', {useCache: false}, this.callback);
        },
        'is array': function(err, links) {
            assert.isNull(err);
            assert.isArray(links);
        },
        'is not empty': function(err, links) {
            assert.isNotZero(links.length);
        },
        'is valid': function(err, links) {
            links.forEach(function(link) {
                assert.isObject(link);
                assert.isString(link.href);
                assert.match(link.href, /^https?:\/\//);
                assert.isString(link.rel);
                assert.isString(link.type);
            });
        }
    },
    'Get oEmbed links for known provider': {
        topic: function() {
            iframely.getOembedLinks('http://vimeo.com/8005491', this.callback);
        },
        'is array': function(err, links) {
            assert.isNull(err);
            assert.isArray(links);
        },
        'is not empty': function(err, links) {
            assert.isNotZero(links.length);
        },
        'is valid': function(err, links) {
            links.forEach(function(link) {
                assert.isObject(link);
                assert.isString(link.href);
                assert.match(link.href, /^https?:\/\//);
                assert.isString(link.rel);
                assert.isString(link.type);
            });
        }
    },
    'Get oEmbed as string': {
        topic: function() {
            iframely.getOembedByProvider('http://provider.iframe.ly/oembed?url=http://provider.iframe.ly/video/', {type: 'string'}, this.callback);
        },
        'is string': function(err, oembed) {
            assert.isNull(err);
            assert.isString(oembed);
        }
    },
    'Get oEmbed as object': {
        topic: function() {
            iframely.getOembedByProvider('http://provider.iframe.ly/oembed?url=http://provider.iframe.ly/video/', {type: 'obejct'}, this.callback);
        },
        'is object': function(err, oembed) {
            assert.isNull(err);
            assert.isObject(oembed);
            assert.isString(oembed.version);
            assert.isString(oembed.type);
            assert.isString(oembed.title);
            assert.isString(oembed.html);
        }
    },
    'Get oEmbed as stream': {
        topic: function() {
            iframely.getOembedByProvider('http://provider.iframe.ly/oembed?url=http://provider.iframe.ly/video/', {type: 'stream'}, this.callback);
        },
        'is object': function(err, oembed) {
            assert.isNull(err);
            assert.instanceOf(oembed, events.EventEmitter);
        }
    },
    'Get oEmbed as json': {
        topic: function() {
            iframely.getOembed('http://provider.iframe.ly/video/', {type: 'string', format: 'json'}, this.callback);
        },
        'is valid': function(err, oembed) {
            assert.isNull(err);
            assert.isString(oembed);
            assert.doesNotThrow(function() { JSON.parse(oembed); });
        }
    }
    
})['export'](module);

})();

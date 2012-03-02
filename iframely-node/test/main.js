(function() {

var assert = require('assert');
var events = require('events');
var vows = require('vows');

var iframely = require('../iframely.js');

function assertOembed(oembed) {
    assert.isObject(oembed);
    assert.isString(oembed.version);
    assert.match(oembed.version, /^1\.[01]$/);
    assert.isString(oembed.type);
    assert.match(oembed.type, /^(link|photo|rich|video)$/);
    switch(oembed.type) {
        case 'link':
            break;

        case 'photo':
            assert.isString(oembed.url);
            assert.match(oembed.url, /^https?:\/\//);
            assert.isNumber(oembed.width);
            assert.isNumber(oembed.height);
            break;
            
        case 'rich':
        case 'video':
            assert.isString(oembed.html);
            assert.isNumber(oembed.width);
            assert.isNumber(oembed.height);
            break;
    }
    
    if (oembed.thumbnail_url) {
        assert.isString(oembed.thumbnail_url);
        assert.match(oembed.thumbnail_url, /^https?:\/\//);
        assert.isNumber(oembed.thumbnail_width);
        assert.isNumber(oembed.thumbnail_height);
    }
    
    if (oembed.provider_url) {
        assert.isString(oembed.provider_url);
        assert.match(oembed.provider_url, /^https?:\/\//);
    }
}

vows.describe('Tests')
.addBatch({
    'Get oEmbed links': {
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
    'Get oEmbed links without cache': {
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
            assertOembed(oembed);
        }
    },
    'Get oEmbed as stream': {
        topic: function() {
            iframely.getOembedByProvider('http://provider.iframe.ly/oembed?url=http://provider.iframe.ly/video/', {type: 'stream'}, this.callback);
        },
        'is stream': function(err, oembed) {
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

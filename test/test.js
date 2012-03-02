(function() {

var assert = require('assert');
var events = require('events');
var vows = require('vows');

var providers = require('./providers.json');
var iframely = require('../iframely-node');

var headers = {
    'Original': 'http://iframe.ly/'
};

function getOembed(uri) {
    return function() {
        iframely.getOembedByProvider(uri, {headers: headers}, this.callback);
    };
}

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

function createTopic(url) {
    return {
        topic: getOembed(url),
        'is correct': function(error, res) {
            assert.isNull(error);
            assert.instanceOf(res, events.EventEmitter);
        },
        'is CORS': function(error, res) {
            assert.isObject(res.headers);
            assert.isString(res.headers['access-control-allow-origin']);
        },
        'oEmbed': {
            topic: function(res) {
                res.toOembed(this.callback);
            },
            'is valid': function(error, oembed) {
                assert.isNull(error);
                assertOembed(oembed);
            }
        }
    };
}

function createBatch() {
    var batch = {};
    for (var p in providers) {
        batch[p] = createTopic(providers[p]);
    }
    
    return batch;
}

vows.describe('CORS Providers')
.addBatch(createBatch())['export'](module);

})();

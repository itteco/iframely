(function() {

var assert = require('assert');
var events = require('events');
var vows = require('vows');

var iframely = require('../../../iframely-node');

var api = {
    oembed: function(url, options) {
        return function() {
            iframely.getOembed(url, options, this.callback);
        }
    }
};

var server = require('../server.js');
var baseUrl = server.app.baseUrl = 'http://localhost:8061';

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

function testOembed(type) {
    return {
        topic: api.oembed(baseUrl + '/' + type + '/', {}),
        'is valid': function(error, res) {
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
                assert.equal(oembed.type, type)
                assert.isString(oembed.author_name);
            }
        }
    };
}

vows.describe('Sample Provider')
.addBatch({
    'Get link': testOembed('link'),
    'Get photo': testOembed('photo'),
    'Get rich': testOembed('rich'),
    'Get video': testOembed('video')
})['export'](module);

})();

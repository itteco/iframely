var assert = require('assert'),
    events = require('events'),
    vows = require('vows');

GLOBAL.CONFIG = require('../config');

var iframely = require('../lib/core').getPluginData;
var utils = require('../lib/utils');

// Must be to pass tests.
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err.stack);
});


// TODO: test oebmed only loading without meta.

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

    var notError = function(error, data) {
        assert.isNull(error);
    };
    var hasMeta = function(error, meta) {
        assert.isObject(meta);
    };
    var hasAlternateLinks = function(error, meta) {
        assert.isArray(meta.alternate);
    };
    var hasValidOEmbedObject = function(error, oembed) {
        assertOembed(oembed);
    };
    var hasFullResponse = function(error, data) {
        assert.isString(data.fullResponse);
    };

// TODO: do rest of tests.

vows.describe('Tests')
    .addBatch({

        'vimeo meta': {
            topic: function() {
                iframely("https://vimeo.com/63683408", 'meta', this.callback);
            },
            'not error': notError,
            'has meta': hasMeta
        },

        'vimeo oembed': {
            topic: function() {
                iframely("https://vimeo.com/63683408", 'oembed', this.callback);
            },
            'not error': notError,
            'has valid oEmbed object': hasValidOEmbedObject
        },

        'image size': {
            topic: function() {
                utils.getImageMetadata("http://www.google.com/logos/2013/dia_dos_namorados_2013-1529005-hp.jpg", this.callback)
            },
            'has correct size and type': function(error, data) {
                assert.equal(data.width, 400);
                assert.equal(data.height, 211);
                assert.equal(data.format, "jpeg");
            }
        }
    })['export'](module);
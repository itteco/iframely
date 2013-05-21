(function() {

var assert = require('assert'),
    events = require('events'),
    vows = require('vows');

var iframely = require('../lib/iframely.js');

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
    var hasMeta = function(error, data) {
        assert.isObject(data.meta);
    };
    var hasAlternateLinks = function(error, data) {
        assert.isArray(data.meta.alternate);
    };
    var hasValidOEmbedObject = function(error, data) {
        assertOembed(data.oembed);
    };
    var hasFullResponse = function(error, data) {
        assert.isString(data.fullResponse);
    };

vows.describe('Tests')
    .addBatch({

        'qik meta': {
            topic: function() {
                iframely.getPageData("http://qik.com/video/52767028", {_debugCache: true}, this.callback);
            },
            'not error': notError,
            'has meta': hasMeta,
            'has alternate links': hasAlternateLinks,
            'has valid oEmbed object': hasValidOEmbedObject,
            'has fullResponse': hasFullResponse,
            'not from cache': function(error, data) {
                assert.isFalse(data._debugCache.metaGotFromCache);
                assert.isFalse(data._debugCache.oembedGotFromCache);
                assert.isFalse(data._debugCache.fullResponseGotFromCache);
            },

            '- repeat test with cache': {
                topic: function() {
                    iframely.getPageData("http://qik.com/video/52767028", {_debugCache: true}, this.callback);
                },
                'not error': notError,
                'has meta': hasMeta,
                'has alternate links': hasAlternateLinks,
                'has valid oEmbed object': hasValidOEmbedObject,
                'has fullResponse': hasFullResponse,
                'all from cache': function(error, data) {
                    assert.isTrue(data._debugCache.metaGotFromCache);
                    assert.isTrue(data._debugCache.oembedGotFromCache);
                    assert.isTrue(data._debugCache.fullResponseGotFromCache);
                }
            }
        },

        'getPageData without fullResponse': {
            topic: function() {
                iframely.getPageData("https://vimeo.com/63683408", {fullResponse: false}, this.callback);
            },
            'not error': notError,
            'no fullResponse': function(error, data) {
                assert.isUndefined(data.fullResponse);
            },
            'has meta': hasMeta,
            'has alternate links': hasAlternateLinks,
            'has valid oEmbed object': hasValidOEmbedObject
        },

        'getPageData without oEmbed': {
            topic: function() {
                iframely.getPageData("https://vimeo.com/64114843", {oembed: false}, this.callback);
            },
            'not error': notError,
            'no oembed': function(error, data) {
                assert.isUndefined(data.oembed);
            },
            'has meta': hasMeta,
            'has fullResponse': hasFullResponse,

            '- repeat with oEmbed + another data from cache': {
                topic: function() {
                    iframely.getPageData("https://vimeo.com/64114843", {_debugCache: true}, this.callback);
                },
                'not error': notError,
                'has meta': hasMeta,
                'has alternate links': hasAlternateLinks,
                'has valid oEmbed object': hasValidOEmbedObject,
                'has fullResponse': hasFullResponse,
                'all from cache except oembed': function(error, data) {
                    assert.isTrue(data._debugCache.metaGotFromCache);
                    assert.isFalse(data._debugCache.oembedGotFromCache);
                    assert.isTrue(data._debugCache.fullResponseGotFromCache);
                }
            }
        },

        'getPageData without fullResponse and oEmbed': {
            topic: function() {
                iframely.getPageData("https://vimeo.com/65475425", {oembed: false, fullResponse: false}, this.callback);
            },
            'not error': notError,
            'has meta': hasMeta,
            'no oembed': function(error, data) {
                assert.isUndefined(data.oembed);
            },
            'no fullResponse': function(error, data) {
                assert.isUndefined(data.fullResponse);
            },
            'has meta': hasMeta
        },

        'image size': {
            topic: function() {
                iframely.getImageMetadata("http://rack.3.mshcdn.com/media/ZgkyMDEzLzA1LzAxLzlkL0FuZGVyc29uVmFsLmM1YTBiLmpwZwpwCXRodW1iCTk1MHg1MzQjCmUJanBn/673862f7/304/Anderson-Valley-composite.jpg", this.callback)
            },
            'has correct size and type': function(error, data) {
                assert.equal(data.width, 950);
                assert.equal(data.height, 534);
                assert.equal(data.format, "JPEG");
            }
        }

})['export'](module);

})();

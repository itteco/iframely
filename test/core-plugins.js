import { assert as assert } from 'chai'

import config from '../config';
global.CONFIG = config;

import { getPluginData as iframely } from '../lib/core';
import { findWhitelistRecordFor as findWhitelistRecordFor } from '../lib/whitelist';
import * as utils from '../lib/utils.js';

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

describe('Core plugins', function() {

    this.timeout(CONFIG.RESPONSE_TIMEOUT);

    describe('meta', function() {

        var error, data;
        
        before(function(done) {
            iframely("http://www.bbc.com/news/science-environment-23767323", 'meta', findWhitelistRecordFor, function(_error, _data) {
                error = _error;
                data = _data;
                done();
            });
        });

        it('not error', function(done) {
            assert.isNull(error);
            done();
        });
        it('has meta', function(done) {
            // TODO: check deep keys and types?
            // TOOD: assert.hasAllKeys in newer mocha?
            // console.log(data)
            assert.property(data, 'description');
            assert.property(data, 'og');
            assert.property(data, 'twitter');
            assert.property(data, 'canonical');
            assert.property(data, 'alternate');
            done();
        });
    });

    describe('oembed', function() {

        var error, data;

        before(function(done) {
            iframely("http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city", 'oembed', findWhitelistRecordFor, function(_error, _data) {
                error = _error;
                data = _data;
                done();
            });
        });

        it('not error', function(done) {
            assert.isNull(error);
            done();
        });
        it('has valid oEmbed object', function(done) {
            assertOembed(data);
            done();
        });

    });

    describe('image size', function() {
        it('has correct size and type', function(done) {
            utils.getImageMetadata("http://www.google.com/logos/2013/dia_dos_namorados_2013-1529005-hp.jpg", function(error, data) {
                assert.equal(data.width, 400);
                assert.equal(data.height, 211);
                assert.equal(data.content_length, 33572);
                assert.equal(data.format, "jpeg");
                done();
            });
        });
    });

});
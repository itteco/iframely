var utils = require('../links/utils');
var _ = require('underscore');

module.exports = {

    getMeta: function(meta, url, whitelistRecord) {

        var iframelyLinks = _.flatten(_.keys(meta).map(function(key) {
            return utils.parseMetaLinks(key, meta[key], whitelistRecord);
        }));
        if (iframelyLinks.length) {
            return;
        }

        // Player.

        var has_player = false;

        if (meta.og) {

            if ((meta.og.type && typeof meta.og.type === 'string' && meta.og.type.match(/video|movie/i)) || /\/videos?\//i.test(url) || /https?:\/\/videos?\./i.test(url)) {

                has_player = true;
            }
            
        } else {
            if (meta.video_src || meta.video_type) {
                has_player = true;
            }
            if (meta.medium === 'video') {
                has_player = true;
            }
        }

        if (meta.twitter) {
            if (meta.twitter.player || meta.twitter.stream) {
                has_player = true;
            }
        }

        if (has_player) {
            return {
                media: 'player'
            };
        }

        // Reader.

        var has_reader = false;

        var has_thumbnail = (meta.og && meta.og.image) || (meta.twitter && meta.twitter.image);

        if (has_thumbnail) {

            if (/article|blog|news|post|noticia/i.test(url) 
                || (/\/(\d{4})\/(\d{2})\/(\d{2})/).test(url) 
                || (meta.og && meta.og.type && typeof meta.og.type === 'string' && /article|post/i.test(meta.og.type))
                || (meta.og && meta.og.video && whitelistRecord.isDefault && whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video') && (typeof meta.og.type !== 'string' || !/video/.test(meta.og.type))) ) {
                
                has_reader = true;
            }
        }

        if (has_reader) {
            return {
                media: 'reader'
            };
        }
    }
};
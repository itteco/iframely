var _ = require('underscore');

var htmlUtils = require('./html-utils');

exports.getOembed = function(uri, data) {

    if (!data) {
        return;
    }

    var oembed = {
        type: 'rich',
        version: '1.0',
        title: data.meta.title
    };

    if (data.meta.author) {
        oembed.author = data.meta.author;
    }
    if (data.meta.author_url) {
        oembed.author_url = data.meta.author_url;
    }
    if (data.meta.site) {
        oembed.provider_name = data.meta.site;
    }

    var thumbnails = htmlUtils.filterLinksByRel("thumbnail", data.links);
    // Find largest.
    var maxW = 0, thumbnail;
    thumbnails && thumbnails.forEach(function(t) {
        var m = t.media;
        if (m && m.width && m.width > maxW) {
            maxW = m.width;
            thumbnail = t;
        }
    });
    // Or first if no sizes.
    if (!thumbnail && thumbnails && thumbnails.length) {
        thumbnail = thumbnails[0];
    }

    if (thumbnail) {
        oembed.thumbnail_url = thumbnail.href;
        var m = thumbnail.media;
        if (m && m.width && m.height) {
            oembed.thumbnail_width = m.width;
            oembed.thumbnail_height = m.height;
        }
    }

    var link;
    var foundRel = _.find(CONFIG.OEMBED_RELS_PRIORITY, function(rel) {
        link = htmlUtils.filterLinksByRel(rel, data.links, {
            returnOne: true,
            excludeRel: CONFIG.R.autoplay
        });
        return link;
    });

    var inlineReader = link && _.intersection(link.rel, [CONFIG.R.inline, CONFIG.R.reader]).length == 2;

    if (link && !inlineReader) {

        var m = link.media;
        if (m) {
            if (m.width && m.height) {
                oembed.width = m.width;
                oembed.height = m.height;
            }
        }

        if (foundRel === CONFIG.R.image && link.type.indexOf('image') === 0) {

            oembed.type = "photo";
            oembed.url = link.href;

        } else if (link.html) {

            oembed.html = link.html;

        } else {
            // "player", "survey", "reader"

            oembed.html = htmlUtils.generateLinkElementHtml(link, {
                iframelyData: data
            });

            if (foundRel === CONFIG.R.player) {
                oembed.type = 'video';
            }
        }

    } else {

        if (link && link.html) {
            oembed.html = link.html;
        } else {
            oembed.type = "link";
            oembed.url = data.meta.canonical || uri;
        }
    }

    return oembed;
};
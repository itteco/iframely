var _ = require('underscore');

var htmlUtils = require('./html-utils');

exports.getOembed = function(uri, data, options) {

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
    if (data.meta.description) {
        oembed.description = data.meta.description;
    }
    if (data.meta.videoId) {
        oembed.videoId = data.meta.videoId;
    }

    // Search only promo for thumbnails.
    var thumbnailLinks = htmlUtils.filterLinksByRel(CONFIG.R.promo, data.links);
    if (thumbnailLinks.length === 0) {
        // Fallback: no promos.
        thumbnailLinks = data.links;
    }

    var thumbnails = htmlUtils.filterLinksByRel(CONFIG.R.thumbnail, thumbnailLinks);
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
    htmlUtils.sortLinks(data.links);
    var foundRel = _.find(options && options.mediaPriority ? CONFIG.OEMBED_RELS_MEDIA_PRIORITY : CONFIG.OEMBED_RELS_PRIORITY, function(rel) {
        link = htmlUtils.filterLinksByRel(rel, data.links, {
            returnOne: true,
            excludeRel: CONFIG.R.autoplay
        });
        return link;
    });

    if (!link) {
        link = _.find(data.links, function(link) {
            return link.type.indexOf('image') === 0 && link.rel.indexOf(CONFIG.R.file) > -1;
        });
        if (link) {
            foundRel = CONFIG.R.image;
        }
    }

    var inlineReader = link && _.intersection(link.rel, [CONFIG.R.inline, CONFIG.R.reader]).length == 2;

    var m = link && link.media;
    if (m) {
        if (m.width) {
            oembed.width = m.width;
        }
        if (m.height) {
            oembed.height = m.height;
        }
    }
    if (link && link.content_length) {
        oembed.content_length = link.content_length;
    }

    if (link && !inlineReader) {

        if (foundRel === CONFIG.R.image && link.type.indexOf('image') === 0) {

            oembed.type = "photo";
            oembed.url = link.href;

        } else if (link.html) {

            oembed.html = link.html;

        } else {
            // "player", "survey", "reader"

            var generateLinkParams = CONFIG.GENERATE_LINK_PARAMS || {};
            _.extend(generateLinkParams, {iframelyData: data});
            oembed.html = htmlUtils.generateLinkElementHtml(link, generateLinkParams);

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

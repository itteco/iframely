var _ = require('underscore');

var htmlUtils = require('./html-utils');

exports.getOembed = function(uri, data, options) {

    if (!data) {
        return;
    }

    var oembed = {
        type: 'rich',
        version: '1.0',
        title: data.meta.title,
        url: data.meta.canonical || uri
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
        if (m["aspect-ratio"] && options && options.targetWidthForResponsive) {
            oembed.width = options.targetWidthForResponsive;
            oembed.height = Math.round(options.targetWidthForResponsive / m["aspect-ratio"]);
        }
    }
    if (link && link.content_length) {
        oembed.content_length = link.content_length;
    }

    if (foundRel === CONFIG.R.player) {

        // Link found. Check incompatible rels.
        if (link.rel.indexOf(CONFIG.R.audio) === -1
            && link.rel.indexOf(CONFIG.R.slideshow) === -1
            && link.rel.indexOf(CONFIG.R.playlist) === -1) {

                oembed.type = 'video';
            }
    }

    if (link && !inlineReader) {

        if (foundRel === CONFIG.R.image && link.type.indexOf('image') === 0) {

            oembed.type = "photo";
            // Override url with image href.
            oembed.url = link.href;

        } else if (link.html) {

            oembed.html = link.html;

        } else {
            // "player", "survey", "reader"

            var omit_css = options && options.omit_css;

            var generateLinkOptions = {
                iframelyData: data,
                aspectWrapperClass:     omit_css ? CONFIG.DEFAULT_OMIT_CSS_WRAPPER_CLASS : false,
                maxWidthWrapperClass:   omit_css ? CONFIG.DEFAULT_MAXWIDTH_WRAPPER_CLASS : false,
                omitInlineStyles: omit_css,
                forceWidthLimitContainer: true
            };

            if (CONFIG.GENERATE_LINK_PARAMS) {
                _.extend(generateLinkOptions, CONFIG.GENERATE_LINK_PARAMS);
            }

            oembed.html = htmlUtils.generateLinkElementHtml(link, generateLinkOptions);
        }

    } else {

        if (link && link.html) {
            oembed.html = link.html;
        } else {
            oembed.type = "link";
        }
    }

    if (data.messages && data.messages.length) {
        oembed.messages = data.messages;
    }

    return oembed;
};

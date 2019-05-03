const $ = require('cheerio');
const utils = require('../../lib/utils');
const querystring = require('querystring');
const URL = require("url");

module.exports = {

    re: [
        /^https?:\/\/(www|\w{2})\.scribd\.com\/(?:doc|document|book|read|embeds|presentation|fullscreen)\//i,
    ],

    provides: ['scribdAspect'],

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author",
        "og-image",
        "domain-icon",
        "og-description"
    ],

    getLink: function(url, oembed, scribdAspect, options) {

        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var href = $iframe.attr('src');
            var params = URL.parse(href, true).query;
            var hash = URL.parse(url, true).hash;

            var slideshow = options.getRequestOptions('scribd.slideshow', params.view_mode === 'slideshow');
            if (slideshow) {
                params.view_mode = 'slideshow';
            } else {
                delete params.view_mode;
            }

            var page = options.getRequestOptions('scribe.start_page', params.start_page || (hash && /page=(\d+)/i.test(hash) && hash.match(/page=(\d+)/)[1]) || 1);
            page = parseInt(page);

            if (page && typeof page === 'number' && page !== 1) {
                params.start_page = page;
            } else {
                page = 1; // re-write broken input
                delete params.start_page;
            }

            return {
                href: href.replace(/\?.+/, '') + querystring.stringify(params).replace(/^(.)/, '?$1'),
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.oembed],
                'aspect-ratio': scribdAspect,
                'padding-bottom': 45, // toolbar
                options: {
                    slideshow: {
                        label: 'Show as slideshow',
                        value: slideshow
                    },
                    start_page: {
                        label: CONFIG.L.page,
                        value: page
                    }
                }
            }
        }
    },

    getData: function(og, oembed, options, cb) {

        if (!og.image) {return cb(null, null);}

        utils.getImageMetadata(og.image.value || og.image, options, function(error, data) {

            if (error || data.error) {
                console.log ('Error getting preview for Scribd: ' + error);
            } else {
                return cb(null, {
                    scribdAspect: data.width && data.height ? data.width / data.height : (oembed.thumbnail_height ?  oembed.thumbnail_width / oembed.thumbnail_height : null)
                })

            }
        });
    },

    tests: [{
        noFeeds: true
    },
        "https://www.scribd.com/doc/116154615/Australia-Council-Arts-Funding-Guide-2013",
        "https://www.scribd.com/document/399637688/Prestons-Advert"
    ]


};

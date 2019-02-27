const $ = require('cheerio');
const utils = require('../../lib/utils');

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

    getLink: function(oembed, scribdAspect) {

        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        console.log($iframe.attr('src'));

        if ($iframe.length == 1) {
            return {
                href: $iframe.attr('src').replace("http://", "//"),
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.oembed],
                'aspect-ratio': scribdAspect,
                'padding-bottom': 71 // toolbar
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
        page: "https://www.scribd.com/books/scribd-selects",
        selector: "a.doc_link.book_link"
    },
        "https://www.scribd.com/doc/116154615/Australia-Council-Arts-Funding-Guide-2013",
        "https://www.scribd.com/document/399637688/Prestons-Advert"
    ]


};

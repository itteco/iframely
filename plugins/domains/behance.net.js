var $ = require('cheerio');

module.exports = {

    re: [
        /https?:\/\/www\.behance\.net\/gallery\/([a-zA-Z0-9\-\(\)]+)\/([0-9]+)/i,
        /https?:\/\/www\.behance\.net\/gallery\/([0-9]+)\/([a-zA-Z0-9\-\(\)]+)/i,
        /https?:\/\/([a-z-\.]+)\/gallery\/([a-zA-Z0-9\-\(\)]+)\/([0-9]+)/i,
        /https?:\/\/([a-z-\.]+)\/gallery\/([0-9]+)\/([a-zA-Z0-9\-\(\)]+)/i
    ],

    mixins: [
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "oembed-canonical",
        "copyright",
        "og-description",
        "keywords",
        "oembed-site",
        "oembed-title"
    ],    

    getLink: function(oembed) {

        if (oembed.provider_name !== "Behance") {
            return;
        }

        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length === 1) {

            return {
                href: $iframe.attr('src').replace("http://", "https://"),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.oembed, CONFIG.R.html5],
                "min-width": oembed.thumbnail_width,
                "min-height": oembed.thumbnail_height
            };
        }
    },

    tests: [{
        skipMixins: ["copyright", "og-description"]
    },
        "http://www.behance.net/gallery/ORBITAL-MECHANICS/10105739",
        "http://www.behance.net/gallery/TRIGGER/9939801",
        "http://www.behance.net/gallery/MEGA-CITIES/8406797",
        "http://portfolios.sva.edu/gallery/Threshold-Furniture-Design/720916",
        "http://portfolios.scad.edu/gallery/Privy-Boards-Graphic-Shirts/11126843",
        "http://talent.adweek.com/gallery/ASTON-MARTIN-Piece-of-Art/3043295",
        "http://ndagallery.cooperhewitt.org/gallery/12332063/Barclays-Center"
        // possible false positive: http://www.engadget.com/gallery/a-tour-of-qualcomms-connected-home-of-the-future/3251997/
    ]

};
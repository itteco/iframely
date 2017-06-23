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
        "domain-icon",
        "oembed-author",
        "oembed-canonical",
        "copyright",
        "og-description",
        "keywords",
        "oembed-site",
        "oembed-title"
    ],    

    getLink: function(oembed, meta) {

        var site = (meta.og && meta.og.site_name) || (meta.twitter && meta.twitter.site) || oembed.provider_name;

        if (!site || !/behance/i.test(site)) {
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
                //"min-width": oembed.thumbnail_width,
                "min-height": oembed.thumbnail_height,
                "aspect-ratio": 1 / Math.sqrt(2) // A4
            };
        }
    },

    tests: [{
        skipMixins: ["copyright", "og-description"]
    },
        "http://www.behance.net/gallery/ORBITAL-MECHANICS/10105739",
        "http://www.behance.net/gallery/TRIGGER/9939801",
        "http://www.behance.net/gallery/MEGA-CITIES/8406797",
        "http://portfolios.scad.edu/gallery/Privy-Boards-Graphic-Shirts/11126843",
        "http://ndagallery.cooperhewitt.org/gallery/12332063/Barclays-Center"
        // possible false positives: 
        // http://www.engadget.com/gallery/a-tour-of-qualcomms-connected-home-of-the-future/3251997/
        // http://absurdynka.deviantart.com/gallery/3866789/calligraphy

    ]

};
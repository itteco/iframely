var $ = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/[a-z]+\.cc\.com\//i
    ],

    provides: "sm4",

    mixins: [
        "og-video", // fallback to whitelist if necessary. Plus SSL player, responsive if proper WL is activated.
        "og-image",
        "twitter-image",
        "favicon",
        "og-site",
        "canonical",
        "twitter-description",
        "media-detector",
        "twitter-title"
    ],

    getLink: function(sm4) {

        if (!(sm4.video && sm4.video.embed)) {
            return;
        }

        var $container = $('<div>');
        
        try {
            $container.html(sm4.video.embed);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1 && $iframe.attr('width') && $iframe.attr('height')) {

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": $iframe.attr('width') / $iframe.attr('height')
            };
        }    
    },

    getMeta: function (sm4) {
        return {
            author: sm4.category
        }
    },

    getData: function (meta) {
        if (meta.sm4) {
            return {
                sm4: meta.sm4
            }
        }
    },

    tests: [{
        noFeeds: true,
        skipMixins: [
            'og-site',
            'twitter-image'
        ],
        skipMethods: [
            'getMeta',
            'getLink'
        ]
    },
        "http://thedailyshow.cc.com/guests/neil-degrasse-tyson/2abri1/neil-degrasse-tyson",
        "http://tosh.cc.com/video-clips/gs28zs/kid-delivery",
        "http://www.cc.com/video-clips/vyienh/comedy-central-presents-insane-clown-posse",
        "http://thecolbertreport.cc.com/videos/y8jsuk/stephest-colbchella--013---daft-punk-d"
    ]
};
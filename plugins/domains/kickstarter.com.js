var cheerio = require('cheerio');

module.exports = {

    mixins: [
        "og-title",
        "og-description",
        "canonical",
        "oembed-site",
        "oembed-author",
        "shortlink",

        "twitter-player",
        "og-video",
        "og-image",
        "favicon"
    ],

    getLink: function (meta, oembed) {

        // When there is no project video, Kikstarter's oEmbed has diff output
        // 'meta' param is there to determine if there's a video
        // oembed thumbnail is returned as link and not as mixin to avoid empty results and fallback to generic parsers

        // Also, unfortunatelly, Kickstarter oEmbed API doesn't accept all canonical addresses.
        // We have to rely on auto-discovery as it seems to work. 
        // Ex.: https://www.kickstarter.com/projects/sparkdevices/spark-electron-cellular-dev-kit-with-a-simple-data/posts/1148266

        var links = [{
            href: oembed.thumbnail_url,
            rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
            type: CONFIG.T.image,
            width: oembed.thumbnail_width,
            height: oembed.thumbnail_height
        }];

        var $container = cheerio('<div>');

        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var href = $iframe.attr('src');

            if ((meta.twitter && meta.twitter.card == 'player') || (meta.og && meta.og.type == 'video') || meta.video_src || (href && /video\.html$/.test(href))) {

                links.push ({
                    href: href,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                    "aspect-ratio": oembed.width / oembed.height
                });


            } else {
 
                links.push ({
                    href: href,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.app, CONFIG.R.oembed, CONFIG.R.html5],
                    width: oembed.width,
                    height: oembed.height
                });
            }
        }

        return links;

    },

    tests: [{
        page: "http://www.kickstarter.com/discover/popular?ref=home_popular",
        selector: ".project-title a",
        skipMixins: [
            "twitter-player",
            "og-video"
        ]
    },
        "http://www.kickstarter.com/projects/1104350651/taktik-premium-protection-system-for-the-iphone",
        "https://www.kickstarter.com/projects/1578116861/toejam-and-earl-back-in-the-groove",
        "https://www.kickstarter.com/projects/sparkdevices/spark-electron-cellular-dev-kit-with-a-simple-data/posts/1148266"
    ]
};
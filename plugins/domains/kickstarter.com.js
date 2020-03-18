var utils = require('../../lib/utils');
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
        // "og-image", // Added in getLinks
        "favicon"
    ],

    getLinks: function (meta, oembed, options, cb) {

        // When there is no project video, Kikstarter's oEmbed has diff output
        // 'meta' param is there to determine if there's a video
        // oembed thumbnail is returned as link and not as mixin to avoid empty results and fallback to generic parsers

        // Also, unfortunatelly, Kickstarter oEmbed API doesn't accept all canonical addresses.
        // We have to rely on auto-discovery as it seems to work. 
        // Ex.: https://www.kickstarter.com/projects/sparkdevices/spark-electron-cellular-dev-kit-with-a-simple-data/posts/1148266

        var $container = cheerio('<div>');

        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var href = $iframe.attr('src');

            if ((meta.twitter && meta.twitter.card == 'player') || (meta.og && meta.og.type == 'video') || meta.video_src || (href && /video\.html$/.test(href))) {

                var aspect = oembed.height ? oembed.width / oembed.height : 0;
                var img = (meta.og && meta.og.image && meta.og.image.url) || oembed.thumbnail_url;

                // This is to fix incorrect aspect for both iFrame and images :\
                utils.getImageMetadata(img, options, function(error, data) {

                    var links = [];

                    if (error || data.error) {

                        console.log ('Error getting og image for Kickstarter: ' + error);

                    } else if (data.width && data.height) {

                        links.push({
                            href: img,
                            type: CONFIG.T.image, 
                            rel: CONFIG.R.thumbnail,
                            width: data.width,
                            height: data.height
                        });
                    
                        aspect = Math.max(aspect, data.width / data.height);

                    }

                    links.push({
                        href: href,
                        type: CONFIG.T.text_html,
                        rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                        "aspect-ratio": aspect
                    });

                    return cb(null, links);

                });


            } else {
 
                return cb(null, [{
                    href: href,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.app, CONFIG.R.oembed, CONFIG.R.html5],
                    width: oembed.width,
                    height: oembed.height,
                    scrolling: 'no'
                }, {
                    href: oembed.thumbnail_url,
                    rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                    type: CONFIG.T.image
                }]);
                
            }

        } else {
            cb (null, null);
        }        

    },

    getData: function(url,  cb) {

        if (url.includes('widget/video.html')) {
            return cb({
                redirect: url.replace('widget/video.html', '')
            });

        } else {
            return cb(null, null)
        }
    },

    tests: [{
        noFeeds: true,
        skipMixins: [
            "twitter-player",
            "og-video",
            "favicon"
        ]
    },
        "http://www.kickstarter.com/projects/1104350651/taktik-premium-protection-system-for-the-iphone",
        "https://www.kickstarter.com/projects/1578116861/toejam-and-earl-back-in-the-groove",
        //"https://www.kickstarter.com/projects/sparkdevices/spark-electron-cellular-dev-kit-with-a-simple-data/posts/1148266",
        "https://www.kickstarter.com/projects/1818505613/codeybot-new-robot-who-teaches-coding?ref=home_potd"
    ]
};
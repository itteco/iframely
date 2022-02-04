import * as utils from '../../lib/utils.js';

export default {

    re: [
        /^https?:\/\/(?:www\.)?kickstarter\.com\/projects\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?(?:widget\/video\.html)?(?:\?.*)?$/i
    ],

    mixins: [
        "og-title",
        "og-description",
        "canonical",
        "oembed-site",
        "oembed-author",
        "shortlink",

        // "og-image", // Added in getLinks.
        "favicon"
    ],

    getMeta: function (meta, options) {
        if (!options.redirectsHistory || !/video\.html$/.test(options.redirectsHistory[0])) {
            return {
                medium: 'article'
            }
        }
    },

    getLinks: function (meta, oembed, options, cb) {

        // When there is no project video, Kikstarter's oEmbed contains a summary card. 
        // Yet both go as oembed type "rich".
        // We handle those types separately here.
        // Oembed thumbnail is returned as link and not as mixin to avoid empty results and fallback to generic parsers.

        var iframe = oembed.getIframe();

        if (iframe && iframe.src) {

            if (/video\.html$/.test(iframe.src)) {

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
                        href: iframe.src,
                        type: CONFIG.T.text_html,
                        rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                        "aspect-ratio": aspect
                    });

                    return cb(null, links);

                });


            } else {
 
                return cb(null, [{
                    href: iframe.src,
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
        skipMethods: ["getData", "getMeta"]
    },
        "https://www.kickstarter.com/projects/1104350651/taktik-premium-protection-system-for-the-iphone",
        "https://www.kickstarter.com/projects/1578116861/toejam-and-earl-back-in-the-groove",
        "https://www.kickstarter.com/projects/sparkdevices/spark-electron-cellular-dev-kit-with-a-simple-data",
        "https://www.kickstarter.com/projects/sparkdevices/spark-electron-cellular-dev-kit-with-a-simple-data/widget/video.html",
        "https://www.kickstarter.com/projects/1818505613/codeybot-new-robot-who-teaches-coding?ref=home_potd"
    ]
};
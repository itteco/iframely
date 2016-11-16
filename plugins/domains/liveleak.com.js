var utils = require('../../lib/utils');

module.exports = {

    re: [
        /^https?:\/\/www\.liveleak\.com\/view\?i=([_a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:www\.)?liveleak\.com\/view\?(?:[^&]+&)*i=([_a-zA-Z0-9]+)/i
    ],

    provides: "liveleak",

    mixins: [
        "canonical",
        "og-title",
        "og-description",
        "favicon"
    ],

    getLink: function (liveleak, urlMatch, og, options, cb) {

        // http://edge.liveleak.com/80281E/u/u/thumbs/2013/Jun/4/5d54790ff19a_sf_12.jpg
        // For embedded videos (youtube) - http://edge.liveleak.com/80281E/s/s/17/media17/2014/Jan/13/e477ff3a60ae_embed_thumbnail_... 
        // So we can tell that if og:image contains "embed" - then it's not a hosted video

        var image = liveleak.image || og.image;

        if (!image || image.indexOf ('embed') > -1 || image.indexOf('mature') > -1) {
            cb('Embed videos or mature content not supported');
        }

        utils.getImageMetadata(image, options, function(error, data) {

            if (error || data.error) {
                cb('Image not available => link is not a video or can not be supported');
            } else if (data.content_length) {

                var id = liveleak.id;

                if (!id) {

                    var image_str = image.split('/');
                    var image_name = image_str[image_str.length-1];

                    id = image_name.indexOf(urlMatch[1]) > -1 ? urlMatch[1] : image_name.split('_')[0];
                }
                
                var aspect = data.width && data.height ? data.width / data.height : 640/360;

                aspect = aspect > 1.7 ? 16/9: aspect > 1.1 ? 4/3 : aspect > 0.9 ? 1 : aspect > 0.7 ? 3/4 : 9/16;

                cb (null, [{
                    href: "http://www.liveleak.com/ll_embed?f=" + id,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    "aspect-ratio": aspect
                }, {
                    href: image, 
                    type: CONFIG.T.image,
                    rel: CONFIG.R.thumbnail
                }]);
            }

        });
    },

    getData: function (cheerio) {

        var liveleak = {};

        var $button = cheerio("a[href*='view?f=']");

        if ($button.length == 1) { 

            var href = $button.attr('href');

            if (/\?f=([_a-zA-Z0-9]+)/.test(href)) {
                liveleak.id = href.match(/\?f=([_a-zA-Z0-9]+)/)[1];

                var $img = cheerio("a[href*='view?f='] img");

                if ($img.length) { 
                    liveleak.image = $img.attr('src').replace('_thumb_', '_sf_');
                }

            }
        }

        return {
            liveleak: liveleak
        }
    },

    tests: [{
        feed: "http://www.liveleak.com/rss?featured=1"
    },
        // Mature content - http://www.liveleak.com/view?i=79d_1444884265
        // Not a video - http://www.liveleak.com/view?i=d36_1444922927, broken image
        // Not a video - http://www.liveleak.com/view?i=ee6_1426054685, broken image
        // Not a video - http://www.liveleak.com/view?i=278_1390979374
        // Not a video - http://www.liveleak.com/view?i=c72_1478733344
        "http://www.liveleak.com/view?i=bb0_1464718288", // portrait
        "http://www.liveleak.com/view?i=589_1210016104" // image matches id in URL
    ]
};
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
        "domain-icon"
    ],

    getLink: function (liveleak, urlMatch, og, options, cb) {

        // http://edge.liveleak.com/80281E/u/u/thumbs/2013/Jun/4/5d54790ff19a_sf_12.jpg
        // For embedded videos (youtube) - http://edge.liveleak.com/80281E/s/s/17/media17/2014/Jan/13/e477ff3a60ae_embed_thumbnail_... 
        // So we can tell that if og:image contains "embed" - then it's not a hosted video

        var image = liveleak.image || og.image;
        var img_check = liveleak.image + og.image;

        if (!img_check || img_check.indexOf ('embed') > -1 || img_check.indexOf('mature') > -1) {
            cb('Embed videos or mature content not supported');
        }

        utils.getImageMetadata(image, options, function(error, data) {

            if (error || data.error) {
                cb('Image not available => link is not a video or can not be supported');
            } else if (data.content_length) {

                var links = [{
                    href: image, 
                    type: CONFIG.T.image,
                    rel: CONFIG.R.thumbnail
                }];

                if (liveleak.id) {

                    /*

                    // unfortuantelly, aspect is no longer needed: Liveleak have harcoded their embed player for 16/9

                    var aspect = data.width && data.height ? data.width / data.height : 640/360;
                    aspect = aspect > 1.7 ? 16/9: aspect > 1.1 ? 4/3 : aspect > 0.9 ? 1 : aspect > 0.7 ? 3/4 : 9/16;
                    */

                    links.push({
                        href: "https://www.liveleak.com/ll_embed?f=" + liveleak.id,
                        type: CONFIG.T.text_html,
                        rel: [CONFIG.R.player, CONFIG.R.html5],
                        "aspect-ratio": 16/9
                    });
                }
                
                cb (null, links);
            }

        });
    },

    getData: function (cheerio) {

        var liveleak = {};

        var $video = cheerio("video.video-js");

        if ($video.length == 1) { 

            var poster = $video.attr('poster');

            if (poster) {

                var id = ($video.attr('id') || '').replace(/^player_file_/, '');

                while (poster.indexOf(id) < 0 && id.length > 0) {
                    id = id.substring(0, id.length - 1);
                }

                if (id.length > 6) {
                    liveleak.id = id;
                }

                liveleak.image = poster;

                return {
                    liveleak: liveleak
                }

            }
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
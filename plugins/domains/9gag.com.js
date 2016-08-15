var utils = require('../../lib/utils');

module.exports = {

    re: [
        /^https?:\/\/9gag\.com\/gag\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "favicon",
        "og-description",
        "og-site",
        "og-title",
        "og-image", // for gif thumbnails
        "canonical"
    ],

    provides: "gag_aspect",

    getLink: function(cheerio, gag_aspect) {
        var image;
        
        var $raw_image = cheerio('[data-image]');
        if ($raw_image.length) {

            if ($raw_image.attr('data-mp4')) {

                // ok, use MP4 for new gifvs or original gif image for older (pre-gifv) posts
                return {
                    href: $raw_image.attr('data-mp4').replace(/^https?:/, ''),
                    type: CONFIG.T.video_mp4,
                    rel: [CONFIG.R.player, CONFIG.R.gifv],
                    'aspect-ratio': gag_aspect
                };

            } else if ($raw_image.attr('data-image')) {

                // Used for gifs, but gifv will 404 and it will only thumbnail afterwards
                return {
                    href: $raw_image.attr('data-image').replace(/^https?:/, ''),
                    type: CONFIG.T.image,
                    rel: CONFIG.R.image
                };

            }

        } else {

            // Used for large images.
            $raw_image = cheerio('[data-img]');
            if ($raw_image.length && $raw_image.attr('data-img')) {

                return {
                    href: $raw_image.attr('data-img').replace(/^https?:/, ''),
                    type: CONFIG.T.image,
                    rel: CONFIG.R.image
                };
            }
        }
    },

    getData: function(og, options, cb) {å   
        if (og.image) {

            utils.getImageMetadata(og.image, options, function(error, data) {
                cb(error, {gag_aspect: data.width && data.height ? '' + data.width / data.height : null});
            });
        }
    },
    
    tests: [ {
        page: "http://9gag.com",
        selector: ".badge-item-title a.badge-track"
    },
        "http://9gag.com/gag/5500821",
        "http://9gag.com/gag/arK0nWB", // gifv
        "http://9gag.com/gag/amzozZy"  // gifv
    ]
};

var utils = require('../../../lib/utils');

module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?theatlas\.com\/charts\/([a-zA-Z0-9]+)/i              
    ],    

    mixins: ["*"],

    // Quartz is no longer developing or supporting Atlas.
    // But the old content remains available.
    getLink: function(urlMatch, twitter, options, cb) {

        if (twitter.image) {
            var links = [];

            var thumbnail = twitter.image.value || twitter.image;

            utils.getImageMetadata(thumbnail, options, function(error, data) {

                if (error || data.error) {

                    console.log ('Error getting thumbnail for Atlas: ' + error);

                } else if (data.width && data.height) {

                    links.push({
                        template_context: {
                            id: urlMatch[1],
                            width: data.width,
                            height: data.height,
                            thumbnail: thumbnail
                        },
                        type: CONFIG.T.text_html, 
                        rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                        'aspect-ratio': data.width / data.height
                    });

                }

                cb(null, links);

            });
        }
    },

    tests: [
        "https://www.theatlas.com/charts/4kktBbXJZ"
    ]
};
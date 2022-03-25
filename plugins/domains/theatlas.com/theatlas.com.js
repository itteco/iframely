import * as utils from '../../../lib/utils.js';

export default {

    re: [
        /^https?:\/\/(?:www\.)?theatlas\.com\/charts\/([a-zA-Z0-9]+)/i              
    ],    

    mixins: ["*"],

    // Quartz is no longer developing or supporting Atlas.
    // But the old content remains available.
    getLink: function(urlMatch, twitter) {

        if (twitter.image) {

            var thumbnail = twitter.image.value || twitter.image;
            /**
             * Image size hardcoded due to Amazon bucket currently is disabled.
             * We can not proceed with `utils.getImageMetadata` for size
             */
            return {
                template_context: {
                    id: urlMatch[1],
                    width: 400,
                    height: 300,
                    thumbnail: thumbnail
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                'aspect-ratio': 4/3
            };

        }
    },

    tests: [
        "https://www.theatlas.com/charts/4kktBbXJZ"
    ]
};
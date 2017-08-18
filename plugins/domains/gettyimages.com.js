var $ = require('cheerio');

module.exports = {

    // Photos only for now. TODO: Stay tuned for when video embeds become available or when slideshows get a canonical address.
    re: [
        /^https?:\/\/(?:www\.)?gettyimages\.(?:com|ca|com\.au|be|dk|de|es|fr|in|ie|it|nl|co\.nz|no|at|pt|ch|fi|se|ae|co\.uk|co\.jp)\/(?:detail|license)\/(?:[^\/]+\/[^\/]+\/)?([0-9\-]+)/i,
        /^https?:\/\/(?:www\.)?gettyimages\.(?:com|ca|com\.au|be|dk|de|es|fr|in|ie|it|nl|co\.nz|no|at|pt|ch|fi|se|ae|co\.uk|co\.jp)\/(?:\w+)\/(?:[^\/]+\/?)#[^\/]+picture\-id(\d+)/i,
        /^https?:\/\/(?:www\.)?gettyimages\.(?:com|ca|com\.au|be|dk|de|es|fr|in|ie|it|nl|co\.nz|no|at|pt|ch|fi|se|ae|co\.uk|co\.jp)\/(?:\w+)\/[^\/]+photo\-(\d+)/i,        
        /^https?:\/\/(?:www\.)?gettyimages\.(?:com|ca|com\.au|be|dk|de|es|fr|in|ie|it|nl|co\.nz|no|at|pt|ch|fi|se|ae|co\.uk|co\.jp)\/share\/event\/[^\/#]\/(\d+)/i

    ],

    provides: 'getty',

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "twitter-title"
    ],

    getData: function(urlMatch, request, cb) {

        request({
            uri: "http://embed.gettyimages.com/preview/" + urlMatch[1],
            json: true,
            limit: 1, 
            timeout: 1000,
            prepareResult: function(error, response, body, cb) {

                // Ex: We're having trouble processing your request. -> likely for videos. Stay tuned for when embeds become available

                if (error) {
                    return cb(error);
                }

                if (body.message) {
                    return cb(body.message);
                }

                cb(null, {
                    getty: body
                });
            }
        }, cb);
    },

    getLink: function(getty) {
        
        if (getty.width && getty.height) {
            
            return {
                html: getty.embedTag,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.image, CONFIG.R.inline, CONFIG.R.html5, CONFIG.R.ssl],
                "aspect-ratio": getty.width / getty.height,
                "max-width": getty.width
            };

        }
    },

    tests: [{
        noFeeds: true
    },
        "http://www.gettyimages.ca/detail/photo/reflection-of-trees-high-res-stock-photography/103260792",
        "http://www.gettyimages.com/detail/illustration/pizza-icons-white-series-royalty-free-illustration/185819032",
        "http://www.gettyimages.de/detail/nachrichtenfoto/sylvie-meis-and-daniel-hartwich-attend-the-8th-show-of-nachrichtenfoto/493388593",
        "http://www.gettyimages.com/event/championship-round-two-597177571#rafa-cabrerabello-of-spain-plays-a-shot-on-the-17th-hole-during-the-picture-id584665654",
        "http://www.gettyimages.com/pictures/partners-a-statue-of-walt-disney-and-mickey-mouse-sits-in-news-photo-94967642",
        "http://www.gettyimages.co.uk/consumer/share/event/this-week-in-black-and-white-589477793/495178130",
        "http://www.gettyimages.in/detail/photo/car-accident-high-res-stock-photography/200558056-001"
    ]
};
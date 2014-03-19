var jquery = require('jquery');

module.exports = {

    // Photos only for now. TODO: Stay tuned for when video embeds become available
    re: /^https?:\/\/www\.gettyimages\.(com|ca|com\.au|be|dk|de|es|fr|in|ie|it|nl|co\.nz|no|at|pt|ch|fi|se|ae|co\.uk|co\.jp)\/detail\/(photo|illustration)\/[a-z0-9\-]+\/(\d+)/i,

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
            uri: "http://embed.gettyimages.com/preview/" + urlMatch[3],
            json: true,
            limit: 1, 
            timeout: 1000
        }, function(error, response, body) {

            if (error) {
                return cb(error);
            }
            if (body.message) {
                return cb(body.message);
            }
            cb(null, {
                getty: body
            });
        });
    },

    getLink: function(getty) {


        var $container = jquery('<div>');
        try {
            $container.html(getty.embedTag);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {
            
            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: CONFIG.R.image,
                "aspect-ratio": $iframe.attr('width') / $iframe.attr('height')
            };

        }
    },

    tests: [
        "http://www.gettyimages.ca/detail/photo/reflection-of-trees-high-res-stock-photography/103260792",
        "http://www.gettyimages.com/detail/illustration/pizza-icons-white-series-royalty-free-illustration/185819032"
    ]
};
module.exports = {

    re: /https?:\/\/about\.me\/([a-zA-Z0-9\-]+)/i,

    mixins: [
        "twitter-image",
        "thumbnail",
        "og-image",
        "favicon",
        "author",
        "canonical",
        "twitter-description",
        "keywords",
        "og-site",
        "twitter-title"
    ],

    getLink: function(urlMatch) {

        // Can be embedded inline, but need to research API.

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl],
            html: '<script type="text/javascript" src="' + "//about.me/embed/" + urlMatch[1] +  '"></script>'
        };
    },

    tests: [
        "http://about.me/zachperkins"
    ]
};
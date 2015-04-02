module.exports = {

    mixins: [
        "twitter-image",
        "og-image",
        "canonical",
        "description",
        "keywords",
        "shortlink",
        "twitter-site",
        "twitter-title"
    ],

    getLink: function(twitter) {
        return {
            href: twitter.image.replace(/_h750/, ''),
            type: CONFIG.T.image_jpeg,
            rel: CONFIG.R.image
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://visual.ly/100k-3d-models-uploaded-sketchfab"
    ]
};
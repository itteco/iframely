module.exports = {

    mixins: [
        "oembed-title",
        "oembed-description",
        "oembed-author",
        "oembed-site",
        "oembed-rich",
        "domain-icon"
    ],

    getLink: function (oembed) {

        return {
            href: oembed.image, 
            type: CONFIG.T.image, 
            rel: CONFIG.R.thumbnail
        }

    },

    tests: [{
        noFeeds: true
    }]
};
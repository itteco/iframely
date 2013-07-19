module.exports = {

    re: /^https?:\/\/(?:www\.)?businessinsider\.com\/[\w\-]{10,}/i,

    mixins: [
        "twitter-title",
        "twitter-image"
    ],

    getData: function($selector) {
        return {
            html_for_readability: $selector('div.post-content').html(),
            ignore_readability_error: true
        };
    },

    tests: [
        {
            pageWithFeed: "http://www.businessinsider.com/"
        },
        "http://www.businessinsider.com/just-four-companies-will-produce-the-microchips-on-which-the-global-economy-depends-2013-4"
    ]
};
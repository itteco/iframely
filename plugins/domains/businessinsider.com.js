module.exports = {

    re: /^https?:\/\/(?:www\.)?businessinsider\.com\/[\w\-]{10,}/i,

    mixins: [
        "twitter-title",
        "twitter-image"
    ],

    getData: function($selector) {

        var $content = $selector('.intro-content');

        if ($content.length == 0) {
            $content = $selector('.post-content');
        }

        return {
            html_for_readability: $content.html(),
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
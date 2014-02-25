module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    re: /^https?:\/\/(?:www\.)?businessinsider\.com\/[\w\-]{10,}/i,

    mixins: [
        "twitter-title",
        "twitter-image"
    ],

    getLink: function(cheerio) {

        var $content = cheerio('.intro-content');

        if ($content.length == 0) {
            $content = cheerio('.post-content');
        }

        return {
            html: $content.html(),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline]
        };
    },

    tests: [
        {
            pageWithFeed: "http://www.businessinsider.com/"
        },
        "http://www.businessinsider.com/just-four-companies-will-produce-the-microchips-on-which-the-global-economy-depends-2013-4"
    ]
};
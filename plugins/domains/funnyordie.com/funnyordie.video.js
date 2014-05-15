var jquery = require('jquery');

var re = /^https?:\/\/www\.funnyordie\.com\/videos\//i;

module.exports = {

    re: re,

    mixins: [
        "canonical",
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-duration",
        "og-description",

        "og-image",
        "favicon"
    ],

    getLink: function(oembed) {

        var $container = jquery('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $junk_div = $container.remove('div');
        var $iframe = $container.find('iframe');

        return {
            href: $iframe.attr('src'),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.oembed],
            "aspect-ratio": oembed.width / oembed.height
        }
    },

    tests: [
        "http://www.funnyordie.com/videos/876e737d1e/bieber-after-the-dentist",
        "http://www.funnyordie.com/videos/e14c22ffcd/a-manly-day-in-the-life-of-nick-offerman",
        {
            pageWithFeed: "http://www.funnyordie.com/",
            getUrl: function(url) {
                if (url.match(re)) {
                    return url;
                }
            }
        }
    ]
};
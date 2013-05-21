var jquery = require('jquery');

module.exports = {

    re: /^https?:\/\/(?:www\.)?businessinsider\.com\/[\w\-]{10,}/i,

    mixins: [
        "twitter-title",
        "twitter-image"
    ],

    getLink: function($selector) {

        var $cont = jquery('<div />');

        var content = $selector.find('div.post-content').get(0);

        if (content){
            $cont = jquery(content);
            var image = $selector.find('figure.article-image img').get(0);

            if (image){
                $cont.prepend(image);
            }
        }
        return {
            html: $cont.html(),
            type: CONFIG.T.safe_html,
            rel: CONFIG.R.reader
        };
    },

    tests: [
        {
            pageWithFeed: "http://www.businessinsider.com/"
        },
        "http://www.businessinsider.com/just-four-companies-will-produce-the-microchips-on-which-the-global-economy-depends-2013-4"
    ]
};
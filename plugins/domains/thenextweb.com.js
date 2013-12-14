module.exports = {

    re: /^https?:\/\/thenextweb\.com\/(\w+\/)?\d{4}\/\d{2}\/\d{2}\/.*/i,

    mixins: [
        "author",
        "canonical",
        "og-description",
        "keywords",
        "shortlink",
        "og-site",
        "og-title",
        "date",

        "favicon"
    ],

    getLink: function(meta) {
        return {
            href: meta.og.image,
            type: CONFIG.T.image,
            rel: [CONFIG.R.thumbnail, CONFIG.R.og],
            width: 300,
            height: 250
        };
    },

    getData: function($selector) {

        var $content = $selector('.article-body');

        if ($content.length) {
            var html = $content.html();

            var $image = $selector('.article-featured-image img');

            if ($image.length) {
                html = $image.parent().html() + html;
            }

            return {
                readability_data: {
                    html: html
                }
            };
        }
    },

    tests: [{
        pageWithFeed: "http://thenextweb.com/"
    },
        "http://thenextweb.com/media/2013/04/15/creating-a-youtube-smash/?fromcat=all",
        "http://thenextweb.com/insider/2013/04/15/e-commerce-startup-buyreply-raises-1m-seed-round-from-peter-thiels-firm-and-others/?fromcat=all"
    ]
};
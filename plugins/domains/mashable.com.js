module.exports = {

    re: /^https?:\/\/mashable\.com\/\d{4}\/\d{2}\/\d{2}\/.*/i,

    mixins: [
        // TODO: reuse plugin
        //"parsely-page",
        "canonical",
        "shortlink",
        "og-site",
        "description",

        "favicon",
        "twitter-image"
    ],

    getMeta: function(meta) {
        var p = meta["parsely-page"];
        if (p) {
            var parsely_page = JSON.parse(p);
            return {
                title: parsely_page.title,
                date: parsely_page.pub_date,
                author: parsely_page.author,
                keywords: parsely_page.tags && parsely_page.tags.join(', '),
                category: parsely_page.section
            };
        }
    },

    getData: function($selector) {

        var $html = $selector('section.article-content')

        if ($html.length) {

            var $image = $selector('figure.article-image img');

            var html = '';

            if ($image.length) {
                html = $image.parent().html();
            }

            html += $html.html();

            return {
                readability_data: {
                    html: html
                }
            };
        }
    },

    tests: [{
        pageWithFeed: "http://mashable.com/"
    },
        "http://mashable.com/2012/11/02/curiosity-rover-self-portrait/"
    ]
};
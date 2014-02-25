module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    re: /^https?:\/\/mashable\.com\/\d{4}\/\d{2}\/\d{2}\/.*/i,

    mixins: [
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

    getLink: function(cheerio) {

        var $html = cheerio('section.article-content')

        if ($html.length) {

            return {
                html: $html.html(),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]
            };
        }
    },

    tests: [{
        pageWithFeed: "http://mashable.com/"
    },
        "http://mashable.com/2012/11/02/curiosity-rover-self-portrait/"
    ]
};
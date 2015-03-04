module.exports = {

    mixins: [
        "copyright",
        "favicon"
    ],

    getMeta: function(cheerio, __readabilityEnabled) {
        return  {
            title: cheerio("#firstHeading").text()
        }
    },

    getLinks: function(cheerio, __readabilityEnabled) {

        var links = [];

        var $img = cheerio(".tright .thumbimage");

        if ($img.length) {
            links.push ({
                href: $img.attr('src'),
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: $img.attr('width'),
                height: $img.attr('height')
            });
        }

        var $html = cheerio("#bodyContent");

        links.push ({
            html: $html.html(),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline]
        });

        return links;
    },

    tests: [
        "http://commons.wikimedia.org/wiki/Commons:Welcome",
        "http://commons.wikimedia.org/wiki/Main_Page",
        {
            noFeeds: true,
            skipMethods: [
                "getLink"
            ]
        }
    ]
};
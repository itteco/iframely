var $ = require('cheerio');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author"
    ],

    getLink: function(oembed) {

        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');
        var doc; 

        if ($iframe.length == 1) {
            doc = {
                href: $iframe.attr('src').replace("http://", "//"),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.oembed],
                "aspect-ratio": $iframe.attr('data-aspect-ratio')
            }
        }

        return [doc, {
                href: '//www.scribd.com/favicon.ico',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
        }];
    },

    tests: [{
        page: "https://www.scribd.com/books/scribd-selects",
        selector: "a.doc_link.book_link"
    },
        "http://www.scribd.com/doc/116154615/Australia-Council-Arts-Funding-Guide-2013"
    ]


};

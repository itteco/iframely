var $ = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/(www|\w{2})\.scribd\.com\/(?:doc|document|book|read|embeds|presentation)\//i,
    ],    

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author",
        'domain-icon'
    ],

    getLink: function(oembed) {

        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {
            return {
                href: $iframe.attr('src').replace("http://", "//"),
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.oembed],
                "aspect-ratio": oembed.thumbnail_height ?  oembed.thumbnail_width / oembed.thumbnail_height : null
            }
        }
    },

    tests: [{
        page: "https://www.scribd.com/books/scribd-selects",
        selector: "a.doc_link.book_link"
    },
        "https://www.scribd.com/doc/116154615/Australia-Council-Arts-Funding-Guide-2013"
    ]


};

var cheerio = require('cheerio');

module.exports = {

    re: /^https?:\/\/(?:www\.)?ted\.com\/talks\//i,

    mixins: [
        "og-image",
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "oembed-canonical",
        "og-description",
        "keywords",
        "oembed-site",
        "oembed-title"
    ],

    getLink: function(oembed) {

        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // iframe is with ".html" which re-directs to http://* w/o ".html". = bye-bye SSL.
        if ($iframe.length == 1) {
            return {
                type: CONFIG.T.text_html, 
                rel:[CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                href: $iframe.attr('src').replace(/\.html$/i, ''),
                "aspect-ratio": oembed.width / oembed.height
            }
        }
    },    

    tests: [{
        page: "http://www.ted.com/talks",
        selector: "#browse-results a"
    },
        "http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city"
    ]
};
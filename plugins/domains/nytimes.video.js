var cheerio = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/www\.nytimes\.com\/video\/\w+\/(\d+)\//,
        /^https?:\/\/www\.nytimes\.com\/video\/\w+\/\w+\/(\d+)\//
    ], 

    mixins: [
        "oembed-thumbnail",
        "domain-favicon",
        "oembed-author",
        "oembed-canonical",
        "media-detector",
        "oembed-site",
        "oembed-title",
        "og-image"
    ],

    getMeta: function(oembed) {

        return {
            description: oembed.summary, 
            date: oembed.publication_date
        }
    },

    getLink: function(oembed) {

        if (oembed.type === "video" || oembed.type === "rich" ) {

            var $container = cheerio('<div>');
            try {
                $container.html(oembed.html5 || oembed.html);
            } catch (ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1) {

                return {
                    href: $iframe.attr('src'),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    "aspect-ratio": 1.45 // temporary until fixed padding is available or until oembed has proper width and height
                }
            }
        }
    },

    tests: [
        "http://www.nytimes.com/video/nyregion/100000003880254/a-complicated-love-story.html?playlistId=1194811622241",
        "http://www.nytimes.com/video/realestate/100000003852081/block-by-block-hoboken.html?playlistId=1194811622241",
        "http://www.nytimes.com/video/world/middleeast/100000004055530/turkey-footage-shows-plane-blast.html"
    ]
};
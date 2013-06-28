var $ = require('jquery');

module.exports = {

    re: /http:\/\/\w+\.wikipedia\.org\/wiki\/File:/i,

    mixins: [
        "copyright",
        "favicon"
    ],

    getMeta: function($selector) {

        return  {
            title: $selector("#firstHeading").text().replace(/^File:/, "").replace(/\.\w+$/, ""),
            description: $selector("td.description").text(),
            date: $selector("time.dtstart[datetime]").attr("datetime"),
            author: $selector("#fileinfotpl_aut").next().text()
        }
    },

    getLinks: function($selector) {

        var links = [];

        var $imgs = $selector('.mw-thumbnail-link');

        if ($imgs.length) {
            $imgs.each(function() {
                var $img = $(this);

                var width, height;

                var dims = $img.text().match(/([\d,.]+)\s+×\s+([\d,.]+)/);

                if (dims) {
                    width = dims[1].replace(/[,.]/g, "");
                    height = dims[2].replace(/[,.]/g, "");
                }

                links.push({
                    href: $img.attr('href'),
                    type: CONFIG.T.image,
                    rel: width && width > 500 ? CONFIG.R.image : CONFIG.R.thumbnail,
                    width: width,
                    height: height
                });
            });
        }

        var $img = $selector(".fullImageLink img");
        if ($img.length) {

            var width = $img.attr('width');
            var height = $img.attr('height');

            links.push({
                href: $img.attr('src'),
                type: CONFIG.T.image,
                rel: width && width > 500 ? CONFIG.R.image : CONFIG.R.thumbnail,
                width: width,
                height: height
            });
        }

        return links;
    },

    tests: [{
        page: "http://en.wikipedia.org/wiki/Wikipedia:Featured_pictures",
        selector: "dd a.image"
    },
        "http://en.wikipedia.org/wiki/File:F-16_June_2008.jpg",
        "http://en.wikipedia.org/wiki/File:Morning_Energy_-_Ardrossan_Wind_Farm_From_Portencross_-_geograph.org.uk_-_1088264.jpg"
    ]
}
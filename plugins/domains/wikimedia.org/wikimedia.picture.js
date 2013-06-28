var $ = require('jquery');

module.exports = {

    re: /\/wiki\/File:/i,

    mixins: [
        "copyright",
        "favicon"
    ],

    getMeta: function($selector) {
        return  {
            title: $selector("#firstHeading").text().replace(/^[^:]:/, "").replace(/\.\w+$/, ""),
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
        page: "http://commons.wikimedia.org/wiki/Commons:Picture_of_the_day",
        selector: "a.image"
    },
        "http://commons.wikimedia.org/wiki/File:Common_Pierrot_Castalius_rosimon_by_kadavoor.JPG"
    ]
};
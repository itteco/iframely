module.exports = {

    mixins: [
        "copyright",
        "favicon"
    ],

    getMeta: function($selector) {
        return  {
            title: $selector("#firstHeading").text()
        }
    },

    getLink: function($selector) {

        var $img = $selector(".tright .thumbimage");

        if ($img.length) {
            return {
                href: $img.attr('src'),
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: $img.attr('width'),
                height: $img.attr('height')
            };
        }
    },

    getData: function($selector) {
        var $html = $selector("#bodyContent");

        return {
            html_for_readability: $html.html(),
            ignore_readability_error: true
        };
    },

    tests: [{
        page: "http://en.wikipedia.org/wiki/Wikipedia:Featured_articles",
        selector: "tr:nth-child(3) a"
    },
        "http://en.wikipedia.org/wiki/Comparison_of_European_road_signs",
        {
            skipMethods: "getLink"
        }
    ]
}
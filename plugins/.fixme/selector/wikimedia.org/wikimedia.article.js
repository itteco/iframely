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
            readability_data: {
                html: $html.html()
            }
        };
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
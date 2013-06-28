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

    getData: function($selector) {
        var $html = $selector("#bodyContent");

        return {
            html_for_readability: $html.html(),
            ignore_readability_error: true
        };
    },

    tests: [{
        feed: "http://en.wikipedia.org/w/index.php?title=Special:RecentChanges&feed=atom"
    },
        ""
    ]
}
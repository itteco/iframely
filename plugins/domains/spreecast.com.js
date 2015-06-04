module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?spreecast\.com\/events\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, meta) {

        return [{
            href: "http://www.spreecast.com/events/" + urlMatch[1] + "/embed-large",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 900,
            height: 470
        }, {
            href: "http://www.spreecast.com/events/" + urlMatch[1] + "/embed-medium",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 500,
            height: 470
        }];
    },

    tests: [
        "http://www.spreecast.com/events/how-to-invest-with-index-funds-and-etfs/"
    ]
};
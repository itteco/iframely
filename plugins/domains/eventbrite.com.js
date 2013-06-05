module.exports = {

    re: /^http:\/\/www\.eventbrite\.com\/event\/([0-9\-]+)/i,

    mixins: [
        "canonical",
        "og-title",
        "og-location",
        "og-description",
        "og-site",
        "og-image",
        "keywords",
        "favicon"
    ],

    getLinks: function(urlMatch) {

        return {
            href: "http://www.eventbrite.com/tickets-external?v=2&eid=" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            "min-width": "500"
        };
    },

    tests: [
        "http://www.eventbrite.com/event/4420461720?ref=etckt"
    ]
};
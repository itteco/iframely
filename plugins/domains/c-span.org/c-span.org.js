module.exports = {

    re: /^https?:\/\/www\.c-span\.org\/video\/\?(c?[\d-]+)(\/[\w-]+)/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        return {
            href: "https://www.c-span.org/video/standalone/?" + urlMatch[1] + urlMatch[2],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': 16/9,
            'padding-bottom': 40 + /*margin-top*/ 10 + /*margin-bottom*/ 10,
            'max-width': 1024
        };
    },

    getData: function(url, __statusCode, options, cb) {
        if (__statusCode === 403) {
            // Ignore...
            return cb(null, null);

        } else {
            return cb({
                responseStatusCode: __statusCode
            });
        }
    },

    tests: [{noFeeds: true},
        "https://www.c-span.org/video/?306629-5/law-sea-treaty",
        "https://www.c-span.org/video/?c4542435/house-floor-may-11-1995-rep-cunningham-homos-military-sensanders-insulted-thousands-men-women-put",
        "https://www.c-span.org/video/?509404-1/house-session"
    ]

};
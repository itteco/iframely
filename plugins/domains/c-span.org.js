module.exports = {

    re: /^http:\/\/www\.c-span\.org\/video\/\?(c?[\d-]+)(\/[\w-]+)/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, cheerio) {

        return {
            href: "http://www.c-span.org/video/standalone/?" + urlMatch[1] + urlMatch[2],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': 1024/616,
            'max-width': 1024
        };
    },

    tests: [{
        page: 'http://www.c-span.org/search/',
        selector: '.onevid a.thumb'
    },
        "http://www.c-span.org/video/?306629-5/law-sea-treaty",
        "http://www.c-span.org/video/?c4542435/house-floor-may-11-1995-rep-cunningham-homos-military-sensanders-insulted-thousands-men-women-put"
    ]

};
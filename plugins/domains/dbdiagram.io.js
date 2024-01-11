export default {

    re: /^https?:\/\/dbdiagram\.io\/(?:d|embed)\/(?:[a-zA-Z0-9\-]+\-)?([a-zA-Z0-9]+)/i,

    mixins: [
        "*"
    ],

    // https://dbdiagram.isnoting.com/vpoh2m/support-embedded-diagrams
    getLink: function(urlMatch) {
        return {
            href: `https://dbdiagram.io/embed/${urlMatch[1]}`,
            rel: [CONFIG.R.app, CONFIG.R.iframely],
            type: CONFIG.T.text_html,
            'aspect-ratio': 16/9
        };
    },

    tests: [{noFeeds: true}, {skipMethods: ['getData']},
        "https://dbdiagram.io/d/6201630385022f4ee5518762",
        "https://dbdiagram.io/embed/61eeb8797cf3fc0e7c5d74aa",
        "https://dbdiagram.io/d/61f2c0ec85022f4ee5019a3b",
        "https://dbdiagram.io/embed/5cf4e1101f6a891a6a658ef9",
        "https://dbdiagram.io/d/Webtraffic-Syndicate-659ef439ac844320aea87aa0"
    ]

};
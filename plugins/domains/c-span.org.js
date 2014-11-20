module.exports = {

    re: /^http:\/\/www\.c-span\.org\/video\/\?([\d-]+)(\/[\w-]+)/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch, cheerio) {

        return {
            href: "http://www.c-span.org/video/standalone/?" + urlMatch[1] + urlMatch[2],
            rel: CONFIG.R.player,
            type: CONFIG.T.text_html,
            'aspect-ratio': 1024/616
        };
    },

    tests: [{
        page: 'http://www.c-span.org/search/',
        selector: '.onevid a.thumb'
    },
        "http://www.c-span.org/video/?306629-5/law-sea-treaty"
    ]

};
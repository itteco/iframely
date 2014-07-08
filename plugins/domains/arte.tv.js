var re = /^http:\/\/www\.arte\.tv\/guide\/(\w+)\/([\d-]+)\//i;

module.exports = {

    re: re,

    mixins: [
        "og-image",
        "favicon",
        "twitter-author",
        "canonical",
        "date",
        "og-site",
        "twitter-title"
    ],

    getLink: function(urlMatch) {
        return [{
            href: 'http://www.arte.tv/guide/' + urlMatch[1] + '/embed/' + urlMatch[2] + '/small',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 300,
            height: 170
        }, {
            href: 'http://www.arte.tv/guide/' + urlMatch[1] + '/embed/' + urlMatch[2] + '/medium',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 600,
            height: 340
        }, {
            href: 'http://www.arte.tv/guide/' + urlMatch[1] + '/embed/' + urlMatch[2] + '/large',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 900,
            height: 510
        }]
    },

    tests: [{
        page: 'http://www.arte.tv/guide/de',
        selector: 'li a',
        getUrl: function(url) {
            if (url.match(re)) return url;
        }
    },
        "http://www.arte.tv/guide/fr/050305-000/valery-giscard-d-estaing-et-helmut-schmidt#details-functions-share"
    ]
};
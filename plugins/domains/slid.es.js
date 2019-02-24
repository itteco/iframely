module.exports = {
    re: [
        /^https?:\/\/slides\.com\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    highestPriority: true, 

    mixins: [
        "*"
    ],

    getMeta: function(urlMatch) {
        return {
            media: 'player'
        }
    },

    getLink: function(urlMatch) {

        return {
            href: urlMatch[0].replace('http://', '//') + "/embed",
            accept: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 640 / 360
        };
    },

    getData: function (url, cb) {

        cb (/^(https?:\/\/slides\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+)\/embed/i.test(url)
            ? {redirect: url.match(/^(https?:\/\/slides\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+)\/embed/i)[1]} 
            : null);
    },

    tests: [{skipMethods: ["getData"]},
        "http://slides.com/timkindberg/ui-router"
    ]
};

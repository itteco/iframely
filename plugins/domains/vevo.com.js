module.exports = {

    re: [
        /^http:\/\/www\.vevo\.com\/watch\/([a-zA-Z\-]+)\/([a-zA-Z\-]+)\/([A-Z0-9]+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "keywords",
        "site"
    ],

    getMeta: function(urlMatch) {

        // no semantic available, even for the title :\
        // TODO: Keep an eye on it

        return {
            title: (urlMatch[1].substring(0, 1).toUpperCase() + urlMatch[1].substring(1) + ": "+ urlMatch[2].substring(0, 1).toUpperCase() + urlMatch[2].substring(1)).replace (/\-/g, " ")
        };
    },


    getLink: function(urlMatch) {

        // no thumbnail available yet :\
        // no SSL 
        // TODO: Keep an eye on it

        // http://cache.vevo.com/m/html/embed.html?video=USYAH1300039
        return {
            href: "http://cache.vevo.com/m/html/embed.html?video=" + urlMatch[3],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 575 / 324
        };
    },


    tests: [ 
        "http://www.vevo.com/watch/royksopp/the-girl-and-the-robot/FRA110900110"
    ]
};
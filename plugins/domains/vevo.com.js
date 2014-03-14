module.exports = {

    re: [
        /^http:\/\/www\.vevo\.com\/watch\/([a-zA-Z\-]+)\/([a-zA-Z\-]+)\/([A-Z0-9]+)/i,
        /^http:\/\/www\.vevo\.com\/watch\/([A-Z0-9]+)/i
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

        if (urlMatch.length < 3) return {title: urlMatch[1]}

        return {
            title: (urlMatch[1].substring(0, 1).toUpperCase() + urlMatch[1].substring(1) + ": "+ urlMatch[2].substring(0, 1).toUpperCase() + urlMatch[2].substring(1)).replace (/\-/g, " ")
        };
    },


    getLink: function(urlMatch) {

        // no thumbnail available yet :\
        // no SSL 
        // TODO: Keep an eye on it

        var id = urlMatch.length < 3 ? urlMatch[1] : urlMatch[3];

        // http://cache.vevo.com/m/html/embed.html?video=USYAH1300039
        return {
            href: "http://cache.vevo.com/m/html/embed.html?video=" + id,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 575 / 324
        };
    },


    tests: [ 
        "http://www.vevo.com/watch/royksopp/the-girl-and-the-robot/FRA110900110",
        "http://www.vevo.com/watch/USSM21400157"
    ]
};
module.exports = {

    re: /http:\/\/imgur\.com\/\w+\/(\w+).*/i,

    mixins: [
        "twitter-title",
        "description",
        "canonical",
        "keywords",

        "favicon",
        "twitter-image-rel-image"
    ],

    getLink: function(urlMatch, meta) {

        var links = [];

        if (meta.twitter && meta.twitter.image && !meta.twitter.image.width) {
            links.push({
                href: "http://imgur.com/a/" + urlMatch[1] + "/embed",
                rel: CONFIG.R.player,
                type: CONFIG.T.text_html,
                "aspect-ratio": 4/3
            });
        }

        var src;
        if (meta.twitter && meta.twitter.image && (src = meta.twitter.image.url) && src.match(/\.(jpg|png|gif)$/)) {
            links.push({
                href: src.replace(/\.(jpg|png|gif)$/, "b.$1"),
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image,
                width: 160,
                height: 160
            });
        }

        return links;
    },

    tests: [{
        pageWithFeed: "http://imgur.com/"
    },
        "http://imgur.com/Ks3qs"
    ]
};
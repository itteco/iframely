module.exports = {

    re: /https?:\/\/imgur\.com\/(?:\w+\/)?(\w+).*/i,

    mixins: [
        "favicon",
        "canonical",
        "oembed-author",
        "twitter-image", // both as fall back, and as thumbnails for galleries
        "twitter-title",
        "oembed-site"
    ],

    getLink: function(oembed, og) {

        var links = [];

        // gifv
        if (og.type === 'video.other' && og.video && og.video.length > 1 && og.video[1].type === 'video/mp4') {
            var v = og.video[1];
            links.push({
                href: v.url.replace("http://", "//"),
                type: v.type,
                rel: [CONFIG.R.player, CONFIG.R.og, CONFIG.R.gifv],
                width: v.width,
                height: v.height
            });
        }

        // oembed photo isn't used as of May 18, 2015

        if (oembed.type == "rich") {
            links.push({
                html: oembed.html,
                width: 542,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.oembed, CONFIG.R.html5, CONFIG.R.inline, CONFIG.R.ssl],
            });
        }

        // photo galleries

        if (og.image && og.image instanceof Array) {
            var gifs = og.image.filter(function(link) {
                return link.url && link.url.match(/\.gif$/i);
            });

            if (gifs.length) {
                links.push({
                    href: gifs[0].url,
                    type: CONFIG.T.image,
                    rel: [CONFIG.R.og, CONFIG.R.image],
                    width: gifs[0].width,
                    height: gifs[0].height
                });
            }
        }

        return links;
    },

    tests: [{
        pageWithFeed: "http://imgur.com/"
    }, {
        skipMixins: [
            "twitter-image",
            "oembed-author"         // Available for Galleries only
        ]
    },    
        "http://imgur.com/Ks3qs",
        "http://imgur.com/gallery/IiDwq",
        "http://imgur.com/a/yMoaT",
        "https://imgur.com/gallery/B3X48s9",
        "http://imgur.com/r/aww/tFKv2zQ",    // kitten bomb before, doesn't seem to show up any longer
        "http://imgur.com/gallery/bSE9nTM",
        "http://imgur.com/gallery/EqmEsJj"
    ]
};
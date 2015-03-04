var $ = require('cheerio');

module.exports = {

    re: /https?:\/\/imgur\.com\/(?:\w+\/)?(\w+).*/i,

    mixins: [
        "favicon",
        "canonical",
        "oembed-author",
        "twitter-image", // both as fall back, and as thumbnails for galleries
        "oembed-site"
    ],

    getMeta: function(meta) {
        return {
            title: meta.twitter.title.replace('- Imgur', '')
        };
    },

    getLink: function(oembed, og) {

        var links = [];

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

        if (oembed.type === "photo" && oembed.url) {
            links.push({
                href: oembed.url.replace("http://", "//"),
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.width,
                height: oembed.height
            });
        }


        if (oembed.type == "rich") {
            var $container = $('<div>');
            try{
                $container.html(oembed.html5 || oembed.html);
            } catch(ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1) {
                links.push({
                    href: $iframe.attr('src').replace("http://","//"),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                    "aspect-ratio": oembed.width / oembed.height
                });
            }
        }

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
        ],
        skipMethods: ["getLink"]
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
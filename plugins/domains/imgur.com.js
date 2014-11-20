var jquery = require('jquery');

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

    getLink: function(oembed) {

        if (oembed.type === "photo" && oembed.url) {

            return {
                href: oembed.url.replace("http://", "//"),
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.width,
                height: oembed.height
            };
        }


        if (oembed.type == "rich") {
            var $container = jquery('<div>');
            try{
                $container.html(oembed.html5 || oembed.html);
            } catch(ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1) {
                return {
                    href: $iframe.attr('src').replace("http://","//"),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                    "aspect-ratio": oembed.width / oembed.height
                };
            }
        }
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
        "http://imgur.com/r/aww/tFKv2zQ"    // kitten bomb before, doesn't seem to show up any longer
    ]
};
module.exports = {

    re: [
        /https?:\/\/imgur\.com\/t\/\w+\/(\w+).*/i,
        /https?:\/\/imgur\.com\/topic\/[a-zA-Z0-9\-_&]+\/(\w+).*/i,
        /https?:\/\/imgur\.com\/(?:\w+\/)?(\w+).*/i,
    ],

    provides: ["oembedLinks"],

    mixins: [
        "favicon",
        "canonical",
        "oembed-author",
        "twitter-title",
        "twitter-image",  // image for images, thumbnails for gallery
        "twitter-stream", // only for gifv
        "oembed-site", 
        "domain-icon"
    ],
    
    getLinks: function(urlMatch, oembed, twitter, options) {

        var links = [];

        if (twitter.image && twitter.image.indexOf && twitter.image.indexOf(urlMatch[1]) > -1 && !twitter.player) {
            links.push({
                href: twitter.image,
                type: CONFIG.T.image_jpeg,
                rel: CONFIG.R.image
            });
        }

        if (oembed.type == "rich") {
            // oembed photo isn't used as of May 18, 2015

            var media_only = options.getProviderOptions('imgur.media_only', false);
            var isGallery = twitter.card !== 'player' && links.length === 0;

            if (!media_only || isGallery) {
                links.push({
                    html: oembed.html,
                    width: oembed.width,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.app, CONFIG.R.oembed, CONFIG.R.html5, CONFIG.R.inline, CONFIG.R.ssl]
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
            "twitter-stream",       // works for GIFvs only
            "oembed-author"         // Available for Galleries only
        ]
    },    
        "http://imgur.com/Ks3qs",
        "http://imgur.com/gallery/IiDwq",
        "http://imgur.com/a/yMoaT",
        "https://imgur.com/gallery/B3X48s9",
        // "http://imgur.com/r/aww/tFKv2zQ",    // kitten bomb before, doesn't seem to show up any longer
        "http://imgur.com/gallery/bSE9nTM",
        "http://imgur.com/gallery/EqmEsJj",
        "https://imgur.com/gallery/kkEzJsa",
        "http://imgur.com/t/workout/HFwjGoF",
        "http://imgur.com/t/water/ud7YwQp",
        "http://imgur.com/topic/The_Oscars_&_Movies/YFQo6Vl"
    ]
};
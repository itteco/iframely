module.exports = {

    re: /https?:\/\/imgur\.com\/(?:\w+\/)?(\w+).*/i,

    provides: ["oembedLinks"],

    mixins: [
        "favicon",
        "canonical",
        "oembed-author",
        "twitter-title",
        "twitter-image",  // image for images, thumbnails for gallery
        "twitter-stream", // only for gifv
        "oembed-site"
    ],
    
    getLink: function(oembed, twitter, options) {

        if (oembed.type == "rich") {
            // oembed photo isn't used as of May 18, 2015

            var media_only = options.getProviderOptions('imgur.media_only', false);
            var isGallery = twitter.card == "gallery";

            if (!media_only || isGallery) {                
                return {
                    html: oembed.html,
                    width: oembed.width,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.app, CONFIG.R.oembed, CONFIG.R.html5, CONFIG.R.inline, CONFIG.R.ssl],
                };
            }
        }
    },

    getData: function (meta, urlMatch, cb) {

         var links =  ['json', 'xml'].map(function(format) {
                return {
                    href: "http://api.imgur.com/oembed." + format + "?url=http://imgur.com/" + (meta.twitter && meta.twitter.card == 'gallery' ? 'a/' : '') + urlMatch[1] ,
                    rel: 'alternate',
                    type: 'application/' + format + '+oembed'
                }
            });        

        cb(null, {
            oembedLinks: links
        });            
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
        "https://imgur.com/gallery/kkEzJsa"
    ]
};
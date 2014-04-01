module.exports = {

    re: /https?:\/\/imgur\.com\/(?:\w+\/)?(\w+).*/i,

    mixins: [
        "favicon",
        "oembed-video-responsive",
        "og-site"
    ],

    getMeta: function(meta) {
        return {
            title: meta.twitter.title.replace('- Imgur', ''),
        };
    },

    getLink: function(oembed, meta) {

        var links = [];

        // processing photos. 
        // But in some cases, oembed photo shows the kitten instead of proper image. 
        // In this cases - fall back to twitter photo
        if (oembed.type === "photo" && oembed.url && oembed.url === meta.twitter.image.url) {

            links.push({
                href: oembed.url.replace("http://", "//"),
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.width,
                height: oembed.height
            });

        } else if (meta.twitter.image && meta.twitter.image.url) { // the kitten!

            links.push({
                href: meta.twitter.image.url.replace("http://", "//"),
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.thumbnail, CONFIG.R.twitter],
                width: meta.twitter.image.width,
                height: meta.twitter.image.height
            });

        } else { // likely a gallery, push thumbnail

            links.push({
                href: meta.image_src,
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.og],
            });
        }

        return links;
    },    

    tests: [{
        pageWithFeed: "http://imgur.com/"
    }, {
        skipMixins: ["oembed-video-responsive"]
    },    
        "http://imgur.com/Ks3qs",
        "http://imgur.com/gallery/IiDwq",
        "https://imgur.com/gallery/B3X48s9",
        "http://imgur.com/r/aww/tFKv2zQ" // kitten bomb
    ]
};
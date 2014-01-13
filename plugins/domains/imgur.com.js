module.exports = {

    re: /http:\/\/imgur\.com\/(?:\w+\/)?(\w+).*/i,

    mixins: [
        "favicon",
        "oembed-video-responsive",
        "oembed-photo",
        "og-image",
        "og-site"
    ],

    getMeta: function(meta) {
        return {
            title: meta.twitter.title.replace('- Imgur', ''),
        };
    },

    getLink: function(oembed) {

        if (oembed.type === "photo" && oembed.url) {

            return {
                href: oembed.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.oembed],
                width: oembed.width,
                height: oembed.height
            };
        }
    },    

    tests: [{
        pageWithFeed: "http://imgur.com/"
    },
        "http://imgur.com/Ks3qs",
        "http://imgur.com/gallery/IiDwq"
    ]
};
module.exports = {

    // hulu.tv shortener is address through the re-directs handling
    re: [
        /^https?:\/\/www\.hulu\.com\/watch\/([a-z0-9\-]+)/i
    ],    

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-duration",
        "oembed-site"
    ],

    getMeta: function(oembed) {

        return {
            date: oembed.air_date,
        };
    },

    getLink: function(oembed) {

        return [{
            href: oembed.embed_url,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": oembed.width / oembed.height
        }, {
            href: oembed.large_thumbnail_url,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail,
            width: oembed.large_thumbnail_width,
            height: oembed.large_thumbnail_height
        }, {
            href: "http://www.hulu.com/fat-favicon.ico",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon,
        }];
    },

    tests: [
        "http://www.hulu.com/watch/494551"
    ]
};
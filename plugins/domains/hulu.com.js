module.exports = {

    // hulu.tv shortener is addressed through the re-directs handling
    re: [
        /^https?:\/\/www\.hulu\.com\/watch\/([a-z0-9\-]+)/i
    ],    

    mixins: [
        "*"
    ],

    getMeta: function(oembed) {

        return {
            date: oembed.air_date
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
        }];
    },

    tests: [
        "http://www.hulu.com/watch/1271"
    ]    
};
module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "oembed-duration",
        "oembed-site",
        "oembed-description"
    ],

    getMeta: function(oembed) {

        return {
            canonical: "http://vimeo.com/" + oembed.video_id
        };
    },


    getLink: function(oembed) {

        return [{
            href: "//player.vimeo.com/video/" + oembed.video_id,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": oembed.width / oembed.height
        }, {
            href: "http://a.vimeocdn.com/images_v6/apple-touch-icon-72.png",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon,
            width: 72,
            height: 72   
        }];
    },

    tests: [{
        feed: "http://vimeo.com/channels/staffpicks/videos/rss"
    },
        "http://vimeo.com/65836516"
    ]
};
module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "oembed-duration",
        "oembed-site",
        "oembed-description",
        "domain-icon"
    ],

    getMeta: function(oembed) {

        return {
            canonical: "https://vimeo.com/" + oembed.video_id,
            date: oembed.upload_date
        };
    },


    getLink: function(oembed, options) {

        var params = options.getProviderOptions('vimeo.get_params', '');
        var autoplay = params + (params.indexOf ('?') > -1 ? "&": "?") + "autoplay=1";

        return [{
            href: "//player.vimeo.com/video/" + oembed.video_id + params,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": oembed.width / oembed.height
        }, {
            href: "//player.vimeo.com/video/" + oembed.video_id + autoplay,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            "aspect-ratio": oembed.width / oembed.height
        }];
    },

    tests: [{
        feed: "http://vimeo.com/channels/staffpicks/videos/rss"
    },
        "http://vimeo.com/65836516",
        {
            skipMixins: [
                "oembed-description"
            ]
        }
    ]
};
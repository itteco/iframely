module.exports = {

    mixins: [
        "canonical",
        "og-title",
        "og-description",
        "og-site",
        "og-image",
        "favicon"
    ],

    getLink: function (meta) {

        if (meta.twitter && meta.twitter.player) {

            return {
                href: meta.twitter.player.value,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                "aspect-ratio": meta.twitter.player.width / meta.twitter.player.height
            };

        } else {

            return {
                href: meta.video_src,
                type: meta.video_type || CONFIG.T.maybe_text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": meta.video_width / meta.video_height
            };
        }
    },    

    tests: [{
        page: 'http://www.livestream.com/guide/livetv',
        selector: '.thumbnail'
    }, {
        skipMixins: [
            "canonical"
        ]
    },
        "http://www.livestream.com/28thwcars/"
    ]
};
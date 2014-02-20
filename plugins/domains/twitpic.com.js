module.exports = {

    mixins: [
        "canonical",
        "og-site",
        "og-title",
        "og-image",
        "twitter-author",
        "favicon"
    ],

    getLink: function (meta) {

        if (meta.twitter.card === "player") return {
                href: meta.twitter.player.value || meta.twitter.player,
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                width: meta.twitter.player.width,
                height: meta.twitter.player.height
            };

        else if (meta.twitter.image) return {
                href: meta.twitter.image.url,
                type: CONFIG.T.image,
                rel: CONFIG.R.image,
                width: meta.twitter.image.width,
                height: meta.twitter.image.height
            }
    },

    tests: [ 
        "http://twitpic.com/8kors1",
        "http://twitpic.com/dfxeqo"
    ]
};
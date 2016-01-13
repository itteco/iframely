module.exports = {

    re:[
        /^https?:\/\/vine\.co\/v\//i
    ],

    mixins: [
        //"twitter-player",
        "twitter-stream",
        //"oembed-video",
        "og-video",
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "canonical",
        "twitter-description",
        "oembed-site",
        "oembed-title"
    ],

    getLink: function (twitter, options) {

        var rel = [CONFIG.R.player];

        if (!(options.getProviderOptions("vine") && options.getProviderOptions("vine").disable_on_mobile)) {
            rel.push(CONFIG.R.html5);
        }

        return {
            href: twitter.player.value,
            type: CONFIG.T.text_html,
            rel: rel,
            "aspect-ratio": twitter.player.width / twitter.player.height
        }
    },

    // plugin is left for tests and speed mostly, as it is well covered by generic plugins
    tests: [
        "https://vine.co/v/bjHh0zHdgZT",
        "https://vine.co/v/blrJgOKXg19",
        "https://vine.co/v/blr5dvQn2xU",
        "https://vine.co/v/blrexgYzeve",
        {
            noFeeds: true
        }
    ]
};
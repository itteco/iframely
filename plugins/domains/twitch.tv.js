module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)$/i,
        /^https?:\/\/(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)\/v\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getMeta: function (oembed) {
        return {
            date: oembed.created_at,
            category: oembed.game,
            duration: oembed.video_length,
            canonical: oembed.request_url
        }
    },

    getLink: function (urlMatch, og) {

        if (og.video) { //skip e.g. https://www.twitch.tv/store

            // add only potentially missing options for each a channel and a clip
            return !urlMatch[2] ? {
                href: "//player.twitch.tv/?channel=" + urlMatch[1]+"&autoplay=false",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 16 /9 
            } : {
                href: "//player.twitch.tv/?video=v" + urlMatch[2]+'&autoplay=true',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
                "aspect-ratio": 16 /9 
            };
        }
    },

    tests: [
        "https://www.twitch.tv/imaqtpie",
        "http://www.twitch.tv/adultswim",
        "https://www.twitch.tv/xleinonen",
        "https://www.twitch.tv/riotgames/v/72749628"
    ]
};
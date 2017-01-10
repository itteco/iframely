module.exports = {

    re: [
        /^https?:\/\/www\.twitch\.tv\/([a-zA-Z0-9_]+)$/i,
        /^https?:\/\/www\.twitch\.tv\/([a-zA-Z0-9_]+)\/v\/(\d+)/i        
    ],

    mixins: [
        "oembed-title",
        "oembed-video",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author",
        "domain-icon"
    ],

    getMeta: function (oembed) {
        return {
            date: oembed.created_at,
            category: oembed.game,
            duration: oembed.video_length,
            canonical: oembed.request_url
        }
    },

    getLink: function (urlMatch, oembed) {

        if (/^video/i.test(oembed.type)) {            
            return !urlMatch[2] ? {
                href: "//player.twitch.tv/?channel=" + urlMatch[1]+"&autoplay=true",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
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
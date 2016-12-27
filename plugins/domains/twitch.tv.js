module.exports = {

    re: [
        /^https?:\/\/www\.twitch\.tv\/([a-zA-Z0-9_]+)$/i,
        /^https?:\/\/www\.twitch\.tv\/([a-zA-Z0-9_]+)\/v\/(\d+)/i        
    ],

    mixins: [
        "*"
    ],

    getLink: function (urlMatch, og) {

        if (/^video/i.test(og.type)) {            
            return !urlMatch[2] ? {
                href: "//player.twitch.tv/?channel=" + urlMatch[1]+"&autoplay=false",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 16 /9 
            } : {
                href: "//player.twitch.tv/?video=v" + urlMatch[2],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.html5],
                "aspect-ratio": 16 /9 
            };
        }
    },

    tests: [
        "https://www.twitch.tv/imaqtpie",
        "http://www.twitch.tv/adultswim",
        "https://www.twitch.tv/xleinonen"
    ]
};
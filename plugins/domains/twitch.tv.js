module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/[a-zA-Z0-9_]+\/v\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/video\/(\d+)/i
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

    getLink: function (urlMatch, meta) {

        // skip e.g. https://www.twitch.tv/store
        // but patch go.twitch.tv beta
        if (!meta.og || (meta.og && meta.og.video)) {

            // add only potentially missing options for each a channel and a clip
            return {
                href: "//player.twitch.tv/?video=v" + urlMatch[1]+'&autoplay=true',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
                "aspect-ratio": 16 /9 
            };
        }
    },

    getData: function (url, urlMatch, cb) {

        cb (/^https?:\/\/player\.twitch\.tv\/\?channel=([a-zA-Z0-9_]+)/i.test(url) ? {
            redirect: "https://www.twitch.tv/" + urlMatch[1]
        } : null);
    },

    tests: [{
        noFeeds: true, skipMethods: ["getMeta", "getData"]
    },
        //"https://www.twitch.tv/riotgames/v/72749628"
    ]
};
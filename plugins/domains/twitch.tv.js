module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/[a-zA-Z0-9_]+\/v\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/videos?\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getMeta: function (oembed) {
        return {
            date: oembed.created_at,
            category: oembed.game,
            duration: oembed.video_length,
            canonical: oembed.request_url,
            views: oembed.view_count
        }
    },

    // plugin is here mostly for automated tests & meta

    tests: [{
        noFeeds: true
    },
        "https://www.twitch.tv/videos/287127728"
    ]
};
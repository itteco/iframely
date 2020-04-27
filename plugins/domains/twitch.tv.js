module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/[a-zA-Z0-9_]+\/v\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/videos?\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getMeta: function (schemaVideoObject) {
        if (schemaVideoObject.embedurl || schemaVideoObject.embedURL) {
            return {
                author: schemaVideoObject.author && schemaVideoObject.author.name,
                author_url: schemaVideoObject.author && schemaVideoObject.author.url,
                date: schemaVideoObject.uploaddate,
                duration: schemaVideoObject.duration,
                views: schemaVideoObject.interactionstatistic && schemaVideoObject.interactionstatistic.userinteractioncount
            }
        }
    },

    // Plugin is here mostly for automated tests & meta.

    tests: [{
        noFeeds: true
    },
        "https://www.twitch.tv/videos/287127728"
    ]
};
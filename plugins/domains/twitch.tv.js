module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/[a-zA-Z0-9_]+\/v\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/videos?\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getMeta: function(schemaVideoObject) {
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

    // Players return 404 errors on HEAD requests as of June 5, 2020. 
    // So need to bypass a validation in a plugin.
    getLink: function(schemaVideoObject) {
        if (schemaVideoObject.embedurl || schemaVideoObject.embedURL) {
            return {
                href: schemaVideoObject.embedurl || schemaVideoObject.embedURL,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                'aspect-ratio': 16/9,
                autoplay: 'autoplay=true'
            }
        }
    },

    tests: [{
        noFeeds: true
    },
        "https://www.twitch.tv/videos/287127728"
    ]
};
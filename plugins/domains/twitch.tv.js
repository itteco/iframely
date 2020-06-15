const URL = require('url');

module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/[a-zA-Z0-9_]+\/v\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/videos?\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)$/i
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
    // As of June 14, 2020 - &parent is now a required option.
    // Docs: https://dev.twitch.tv/docs/embed/video-and-clips
    getLink: function(url, schemaVideoObject, options) {
        if (schemaVideoObject.embedurl || schemaVideoObject.embedURL) {

            var _referrer = options.getRequestOptions('twitch.parent', '').split(/\s*(?:,|$)\s*/);
            var referrer = _referrer.concat(
                    options.getProviderOptions('twitch.parent', '').split(/\s*(?:,|$)\s*/),
                    options.getProviderOptions('iframely.cdn', '').split(/\s*(?:,|$)\s*/)
                );

            var query = URL.parse(url, true).query;
            if (query.parent) {
                referrer.push(query.parent);
            }

            var message = "Twitch requires each domain your site uses. Please configure in your providers settings or add to URL itselsf as &parent=..."

            if (referrer.length === 0) {
                return {
                    message: message
                }
            } else {
                var embedURL = schemaVideoObject.embedurl || schemaVideoObject.embedURL;
                embedURL = embedURL.replace('&parent=meta.tag', '');
                embedURL += '&parent=' + Array.from(new Set(referrer)).join('&parent=');

                return {
                    href: embedURL,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    'aspect-ratio': 16/9,
                    autoplay: 'autoplay=true',
                    options: {
                        parent: {
                            value: options.getRequestOptions('twitch.parent', ''),
                            label: 'Comma-separated list of all your domains',
                            placeholder: 'Ex.: iframe.ly, cdn.iframe.ly, iframely.net'
                        }
                    }
                }
            }
        }
    },

    tests: [{
        noFeeds: true
    },
        "https://www.twitch.tv/videos/287127728"
    ]
};
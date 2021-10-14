import * as URL from 'url';

export default {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/[a-zA-Z0-9_]+\/v\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/(?:[a-zA-Z0-9_]+\/)?videos?\/(\d+)/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)(?:\?parent=.*)?$/i,
        /^https?:\/\/clips.twitch\.tv\/([^\?\/]+)(?:\?[^\?]+)?$/i,
        /^https?:\/\/www\.twitch\.tv\/\w+\/clip\/([^\?\/]+)/i        
    ],

    mixins: ["*"],

    provides: ['embedUrl'],

    getMeta: function(schemaVideoObject) {
        return {
            author: schemaVideoObject.author && schemaVideoObject.author.name,
            author_url: schemaVideoObject.author && schemaVideoObject.author.url,
            date: schemaVideoObject.uploaddate,
            duration: schemaVideoObject.duration,
            views: schemaVideoObject.interactionstatistic && schemaVideoObject.interactionstatistic.userinteractioncount
        }
    },

    // Players return 404 errors on HEAD requests as of June 5, 2020. 
    // So need to bypass a validation in a plugin.
    // As of June 14, 2020 - &parent is now a required option.
    // Docs: https://dev.twitch.tv/docs/embed/video-and-clips
    getLink: function(url, embedUrl, options) {

        var _referrer = options.getRequestOptions('twitch.parent', '').split(/\s*(?:,|$)\s*/);
        var referrer = _referrer.concat(
                options.getProviderOptions('twitch.parent', '').split(/\s*(?:,|$)\s*/)                    
            );

        var query = URL.parse(url, true).query;
        if (query.parent || query._parent) {
            referrer.push(query.parent || query._parent);
        }

        var message = "Twitch requires each domain your site uses. Please configure in your providers settings or add to URL itself as ?_parent=..."

        if (referrer.length === 0) {
            return {
                message: message
            }
        } else {
            referrer = referrer.concat(options.getProviderOptions('iframely.cdn', '').split(/\s*(?:,|$)\s*/));

            var embedURL = embedUrl;
            embedURL = embedURL.replace('&parent=meta.tag', '');
            embedURL += '&parent=' + Array.from(new Set(referrer)).join('&parent=');

            return {
                href: embedURL,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                'aspect-ratio': 16/9,
                autoplay: 'autoplay=true',
                message: message,
                options: {
                    parent: {
                        value: options.getRequestOptions('twitch.parent', ''),
                        label: 'Comma-separated list of all your domains',
                        placeholder: 'Ex.: iframe.ly, cdn.iframe.ly, iframely.net'
                    }
                }
            }
        }
    },

    getData: function(url, og, schemaVideoObject) {

        var embedUrl = schemaVideoObject.embedUrl || schemaVideoObject.embedURL;

        if (url === embedUrl) {
            embedUrl = /\/video\/(\d+)/i.test(url)
                ? `https://player.twitch.tv/?video=${url.match(/\/video\/(\d+)/i)[1]}&autoplay=false`
                : og.video && og.video.secure_url && og.video.secure_url.replace('&player=facebook', '');
        }

        return {
            embedUrl: embedUrl
        }

    },

    tests: [{
        noFeeds: true
    },
        "https://www.twitch.tv/videos/743604531?parent=localhost"
    ]
};
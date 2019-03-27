var DEFAULT_WIDTH = 600;

module.exports = {

    re: /^https?:\/\/(?:\w{2,3}\.)?pinterest(?:\.com?)?\.\w{2,3}\/((?!pin)[a-zA-Z0-9%_]+)\/([a-zA-Z0-9%\-]+)\/?(?:$|\?|#)/i,

    mixins: [
        "*"
    ],

    getLink: function(url, meta, options) {
        var og = meta.og;

        if (/pinboard/.test(og.type) || // this check sometimes when Pinterest misses cache hits: og.type is 'website' in those cases
            (meta.twitter && meta.twitter.app && meta.twitter.app.url && /\/board\//i.test(meta.twitter.app.url.iphone))) {
            return {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.inline, CONFIG.R.html5],
                template: "pinterest.widget",
                template_context: {
                    url: og.url || url,
                    title: "Pinterest Board",
                    type: "embedBoard",
                    width: options.maxWidth || DEFAULT_WIDTH,
                    height: 600,
                    pinWidth: 120
                },
                width: options.maxWidth || DEFAULT_WIDTH,
                height: 600 + 120
            };
        }
    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true
    },
        "http://pinterest.com/bcij/art-mosaics/",
        "http://pinterest.com/bcij/aging-gracefully/",
        "https://www.pinterest.com/mimimememe/office-humor-work-jokes/"
    ]
};
var DEFAULT_WIDTH = 466;

module.exports = {
    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)(?:\?fref=\w+)?$/i
    ],

    getLink: function(facebook_post, options) {
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            template: "facebook.post",
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url,
                type: 'fb-page',
                language_code: CONFIG.providerOptions && CONFIG.providerOptions.facebook && CONFIG.providerOptions.facebook.language_code || 'en_US',
                width: options.maxWidth || DEFAULT_WIDTH
            },
            width: options.maxWidth || DEFAULT_WIDTH
        };
    },

    tests: [
        "https://www.facebook.com/hlaskyjanalasaka?fref=nf",
        {
            noFeeds: true
        }
    ]
};
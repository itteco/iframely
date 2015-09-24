var DEFAULT_WIDTH = 500;

module.exports = {
    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)(?:\?fref=\w+)?$/i
    ],

    getLink: function(facebook_post, options) {

        var width = options.maxWidth || options.getProviderOptions('facebook.width', DEFAULT_WIDTH);

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            template: "facebook.post",
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url,
                type: 'fb-page',
                language_code: options.getProviderOptions('facebook.language_code', 'en_US'),
                width: width
            },
            width: width
        };
    },

    tests: [
        "https://www.facebook.com/hlaskyjanalasaka?fref=nf",
        {
            noFeeds: true
        }
    ]
};
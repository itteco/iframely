var DEFAULT_WIDTH = 550;

module.exports = {

    re: [
        /^https?:\/\/(?:www|m)\.facebook\.com\/(photo|permalink|story|video)\.php\?[^\/]+(\d{10,})/i,
        /^https?:\/\/(?:www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/(posts|activity)\/(\d{10,})/i,
        /^https?:\/\/(?:www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/photos\/[a-zA-Z0-9\.\-]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m)\.facebook\.com\/notes\/([a-zA-Z0-9\.\-]+)\/[^\/]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m)\.facebook\.com\/media\/set\/\?set=[^\/]+(\d{10,})/i,
        /^https?:\/\/(?:www|m)\.facebook\.com\/[a-z0-9.]+\/(video)s\/.+/i
    ],

    getLink: function(facebook_post, urlMatch, options) {

        if (urlMatch[1] === 'video') {
            var media_only = options.getProviderOptions('facebook.media_only', true);
            if (media_only) {
                return;
            }
        }

        var width = options.maxWidth || options.getProviderOptions('facebook.width', DEFAULT_WIDTH);

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url,
                type: 'fb-post',
                language_code: options.getProviderOptions('facebook.language_code', 'en_US'),
                width: width
            },
            width: width
        };
    },

    tests: [
        "https://www.facebook.com/noven.roman/posts/555607674475258",
        "https://www.facebook.com/logvynenko/posts/10151487164961783",
        "https://www.facebook.com/photo.php?fbid=530060777048531&set=a.215094428545169.62692.100001338405848&type=1",
        {
            noFeeds: true
        }
    ]
};
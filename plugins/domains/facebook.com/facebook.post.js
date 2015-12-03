var DEFAULT_WIDTH = 550;

module.exports = {

    re: [
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/(permalink|story)\.php\?[^\/]+(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/photo\.php\?fbid=(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/(posts|activity)\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/photos\/[a-zA-Z0-9\.\-]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/notes\/([a-zA-Z0-9\.\-]+)\/[^\/]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/media\/set\/\?set=[^\/]+(\d{10,})/i
    ],

    getLink: function(oembed, options) {

        var width = options.maxWidth || options.getProviderOptions('facebook.width', DEFAULT_WIDTH);

        var html = oembed.html.replace(/data-width=\"\d+\"/, 'data-width="' + width + '"');
            html = html.replace(/class=\"fb\-video\"/, 'class="fb-post"'); // thank you FB for not working well with photo.php

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5, CONFIG.R.inline],
            html: html, 
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
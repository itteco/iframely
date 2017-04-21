var DEFAULT_WIDTH = 640;

module.exports = {


    re: [
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/(permalink|story)\.php\?[^\/]+(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/photo\.php\?fbid=(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/(posts|activity)\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/photos\/[^\/]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/notes\/([a-zA-Z0-9\.\-]+)\/[^\/]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/media\/set\/\?set=[^\/]+(\d{10,})/i
    ],

    getLink: function(url, oembed, options) {

        var width = options.maxWidth || options.getProviderOptions('facebook.width', DEFAULT_WIDTH);

        var html = oembed.html.replace(/data-width=\"\d+\"/, 'data-width="' + width + '"');
            html = html.replace(/class=\"fb\-video\"/, 'class="fb-post"'); // thank you FB for not working well with photo.php
            html = html.replace(/connect\.facebook\.net\/\w{2}_\w{2}\/sdk\.js/i, 
                'connect.facebook.net/' + options.getProviderOptions('locale', 'en_US') + '/sdk.js'); // FB gives it based on server IP, and it has inaccurate IP2Location 


        if (/comment_id=\d+/i.test(url) && !/class=\"fb\-comment\-embed\"/.test(html)) {
            // thank you FB for not working with comments
            // https://developers.facebook.com/docs/plugins/embedded-comments
            html = html.replace(/class=\"fb\-post\"/, 'class="fb-comment-embed" data-include-parent="' + (!options.getProviderOptions('facebook.exclude_comment_parent') ? 'true' : 'false') + '"'); 
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            html: html, 
            "max-width": width
        };
    },

    tests: [
        "https://www.facebook.com/noven.roman/posts/555607674475258",
        "https://www.facebook.com/logvynenko/posts/10151487164961783",
        "https://www.facebook.com/chamvermeil/photos/a.398119066992522.1073741828.398102673660828/715129168624842/?type=1&theater",
        "https://www.facebook.com/photo.php?fbid=530060777048531&set=a.215094428545169.62692.100001338405848&type=1",
        "https://www.facebook.com/zuck/posts/10102577175875681?comment_id=1193531464007751&reply_comment_id=654912701278942",
        {
            noFeeds: true
        }
    ]
};
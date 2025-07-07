const DEFAULT_WIDTH = 640;

export default {

    re: [
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/(permalink|story)\.php\?[^\/]+(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/photo\.php\?(?:[^\?]+)?fbid=(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/photo\/?\?(?:[^\?]+)?fbid=(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/(posts|activity)\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/(posts|activity)\/pfbid([a-zA-Z0-9\.\-]+)/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/photos(?:\/[^\/]+)?\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/notes\/([^\/\?]+)\/[^\/]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/media\/set\/\?set=[^\/]+(\d{10,})/i
    ],

    mixins: ["fb-error"],

    getLink: function(url, oembed, options) {

        var width = options.getRequestOptions('maxwidth', options.getProviderOptions('facebook.width', DEFAULT_WIDTH));

        var html = oembed.html.replace(/data-width=\"\d+\"/, 'data-width="' + width + '"');
            html = html.replace(/class=\"fb\-video\"/i, 'class="fb-post"'); // thank you FB for not working well with photo.php
            html = html.replace(/connect\.facebook\.net\/\w{2}_\w{2}\/sdk\.js/i,
                'connect.facebook.net/' + options.getProviderOptions('locale', 'en_US').replace('-', '_') + '/sdk.js'); // FB gives it based on server IP, and it has inaccurate IP2Location

        if (/photos?/i.test(url)
            && options.getRequestOptions('facebook.hide_text')
            && !/data-show-text="false"/.test(html)) {
            html = html.replace(/data\-show\-text=\"true\"/i, ''); // never is retured from API, but just to future-proof
            html = html.replace(/class=\"fb\-post\"/, 'class="fb-post" data-show-text="false"' )
        }


        var vary = {};

        if (/photos?/i.test(url)) {
            vary.hide_text = {
                label: 'Hide author\'s text caption',
                value: /data-show-text=\"false\"/i.test(html)
            }
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl],
            html: html,
            options: vary,
            "max-width": width
        };
    },

    tests: [
        "https://www.facebook.com/4/posts/10116513907628531",
        "https://www.facebook.com/zuck/posts/10116325482244511",
        "https://www.facebook.com/zuck/posts/pfbid0p7zmJ1SoeJieavzRAy9mYxJ9i1m28PRDzFC2NCFHe6RMsD7LbuGEu7WtG9ZckUoJl",
        "https://www.facebook.com/logvynenko/posts/10151487164961783",
        "https://www.facebook.com/chamvermeil/photos/a.398119066992522.1073741828.398102673660828/715129168624842/?type=1&theater",
        "https://www.facebook.com/photo?fbid=3242822485762635&set=pcb.3242829905761893",
        "https://www.facebook.com/141700922567987_3903702929701082",
        "https://www.facebook.com/docmonkeyorthoanimal/photos/105294651313771/",
        {noFeeds: true}, {skipMixins: ["fb-error"]}
    ]
};

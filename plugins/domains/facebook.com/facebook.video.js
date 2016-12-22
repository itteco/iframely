module.exports = {

    re: [
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]id=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/[a-zA-Z0-9.]+\/videos\/.+/i
    ],

    getLink: function(url, oembed, options) {

        var html = oembed.html.replace(/connect\.facebook\.net\/\w{2}_\w{2}\/sdk\.js/i, 
                'connect.facebook.net/' + options.getProviderOptions('locale', 'en_US') + '/sdk.js'); 

        var rel = [CONFIG.R.ssl, CONFIG.R.html5]; 

        if (/comment_id=\d+/i.test(url) && !/class=\"fb\-comment\-embed\"/.test(html)) {
            // thank you FB for not working with comments
            // https://developers.facebook.com/docs/plugins/embedded-comments
            html = html.replace(/class=\"fb\-video\"/, 'class="fb-comment-embed" data-include-parent="' + (!options.getProviderOptions('facebook.exclude_comment_parent') ? 'true' : 'false') + '"'); 
            rel.push (CONFIG.R.app);
        } else {
            rel.plush (CONFIG.R.player);
        }


        return {
            type: CONFIG.T.text_html,
            rel: rel,
            html: html,
            "aspect-ratio": oembed.height ? oembed.width / oembed.height : 16/9
        }
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        "https://www.facebook.com/video.php?v=10152309398358392&fref=nf",
        "https://www.facebook.com/video.php?v=4392385966850",
        "https://www.facebook.com/joe.yu.94/videos/10206321173378788/",
        "https://business.facebook.com/KMPHFOX26/videos/10154356403004012/",
        "https://www.facebook.com/tv2nyhederne/videos/1657445024271131/?comment_id=1657463030935997",
        {
            noFeeds: true
        }
    ]
};
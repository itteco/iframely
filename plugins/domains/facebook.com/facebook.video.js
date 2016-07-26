module.exports = {

    re: [
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]id=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/[a-zA-Z0-9.]+\/videos\/.+/i
    ],

    getLink: function(oembed, options) {

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
            html: oembed.html.replace(/connect\.facebook\.net\/\w{2}_\w{2}\/sdk\.js/i, 
                'connect.facebook.net/' + options.getProviderOptions('locale', 'en_US') + '/sdk.js'),
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
        {
            noFeeds: true
        }
    ]
};
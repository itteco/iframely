module.exports = {

    re: [
        /^https?:\/\/www\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
        /^https?:\/\/www\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/[a-z0-9.]+\/videos\/.+/i
    ],

    getLink: function(facebook_post, options) {

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
            template: "facebook.post",
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url,
                type: 'fb-video',
                language_code: options.getProviderOptions('facebook.language_code', 'en_US'),
                width: null
            },
            "aspect-ratio": 16/9
        }
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        "https://www.facebook.com/video.php?v=10152309398358392&fref=nf",
        "https://www.facebook.com/video.php?v=4392385966850",
        "https://www.facebook.com/joe.yu.94/videos/10206321173378788/",
        {
            noFeeds: true
        }
    ]
};
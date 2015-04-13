var DEFAULT_WIDTH = 466;    

module.exports = {

    re: [
        /^https?:\/\/www\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
        /^https?:\/\/www\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i
    ],

    getLink: function(facebook_post) {

        return {

            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
            template: "facebook.post",
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url,
                type: 'fb-video'
            },
            "aspect-ratio": 16/9
        }
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        "https://www.facebook.com/video.php?v=10152309398358392&fref=nf",
        "https://www.facebook.com/video.php?v=4392385966850",
        {
            noFeeds: true
        }
    ]
};
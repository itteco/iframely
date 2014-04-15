module.exports = {

    re: [
        /^https?:\/\/www\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i
    ],

    getLink: function(urlMatch, facebook_post) {

        return {
            href: "//www.facebook.com/video/embed?video_id=" + urlMatch[1],
            title: facebook_post.title,
            type: CONFIG.T.flash,
            rel: CONFIG.R.player,
            "aspect-ratio": 1.5
        }
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        {
            noFeeds: true
        }
    ]
};
var qs = require('querystring');

module.exports = {

    // Re used in facebook.post.
    re: [
        /^https?:\/\/www\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i
    ],

    mixins: [
        "favicon"
    ],

    getMeta: function(meta) {
        return {
            site: "Facebook",
            title: meta["html-title"].replace(" | Facebook", "")
        };
    },

    getLinks: function(url) {

        var urlMatch;

        this.re.forEach(function(re) {
            urlMatch = urlMatch || url.match(re);
        });

        return {
            href: "//www.facebook.com/video/embed?video_id=" + urlMatch[1],
            type: CONFIG.T.flash,
            rel: CONFIG.R.player,
            "aspect-ratio": 1.5
        };
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        {
            noFeeds: true
        }
    ]
};
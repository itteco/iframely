module.exports = {

    re: /^http:\/\/(edition\.)?cnn\.com\/video\//i,

    mixins: [
        "canonical",
        "date",
        "og-site",
        "og-title",
        "og-description",

        "favicon",
        "og-image"
    ],

    getLink: function(meta) {

        var video_url = meta.og.video.url;

        var m = video_url.match(/\.(mp4|ogg|webm)$/);

        if (m) {
            return {
                href: meta.og.video.url,
                type: "video/" + m[1],
                rel: CONFIG.R.player,
                "aspect-ratio": meta.og.video.width / meta.og.video.height
            };
        }
    },

    tests: [
        "http://edition.cnn.com/video/data/2.0/video/world/2013/06/25/intl-snowden-wikileaks-connection-kristinn-hrafnsson-intv.cnn.html",
        "http://edition.cnn.com/video/data/2.0/video/world/2013/06/27/lklv-barnett-safrica-mandela-health.cnn.html",
        "http://edition.cnn.com/video/data/2.0/video/bestoftv/2013/06/26/intl-india-flood-missing-robertson-pkg.cnn.html",
        {
            noFeeds: true
        }
    ]
};
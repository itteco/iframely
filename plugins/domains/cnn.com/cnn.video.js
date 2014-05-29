module.exports = {

    re: /^https?:\/\/((edition|www)\.)?cnn\.com\/video\//i,

    mixins: [
        "canonical",
        "date",
        "og-site",
        "og-title",
        "og-description",

        "favicon",
        "og-image",
        "image_src"
    ],

    getLinks: function(meta) {

        var video = meta.og.video[1];

        return [{
            href: video.url,
            type: video.type,
            rel: CONFIG.R.player,
            "aspect-ratio": 1.777
        }, {
            href: video.secure_url,
            type: video.type,
            rel: CONFIG.R.player,
            "aspect-ratio": 1.777
        }];
    },

    tests: [
        "http://edition.cnn.com/video/data/2.0/video/world/2013/06/25/intl-snowden-wikileaks-connection-kristinn-hrafnsson-intv.cnn.html",
        "http://edition.cnn.com/video/data/2.0/video/world/2013/06/27/lklv-barnett-safrica-mandela-health.cnn.html",
        "http://edition.cnn.com/video/data/2.0/video/bestoftv/2013/06/26/intl-india-flood-missing-robertson-pkg.cnn.html",
        "http://www.cnn.com/video/data/2.0/video/showbiz/2013/12/17/wolf-of-wall-street-jordan-belfort-orig-jtb.cnn.html",
        {
            noFeeds: true
        }
    ]
};
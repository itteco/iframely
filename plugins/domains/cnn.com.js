module.exports = {

    re: [
        /^https?:\/\/(www|edition)\.cnn\.com\/videos\//i,        
    ],

    mixins: [
        "*"
    ],

    getLink: function(og, urlMatch) {

        if (!/video/.test(og.type) || !og.url) {
            return;
        }

        var path = og.url.replace (/^https?:\/\/www\.cnn\.com\/videos\//i, "");

        return {
                href: "http://www.cnn.com/video/api/embed.html#" + path,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 416 / 234
            };
    },

    tests: [
        "http://www.cnn.com/videos/world/2015/06/05/orig-200-pound-ripped-kangaroo-crushes-metal-video.cnn",
        "http://edition.cnn.com/videos/tv/2015/10/30/spc-the-circuit-felipe-massa-versus-felipe-nasr.cnn"
    ]
};
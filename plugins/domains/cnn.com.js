module.exports = {

    re: [
        /^https?:\/\/(www|edition)?\.?cnn\.com\/videos?\//i,
    ],

    mixins: [
        "*"
    ],

    getLink: function(og, urlMatch) {

        if (!/video/.test(og.type) || !og.url) {
            return;
        }

        var path = ((og.video && og.video.url) || og.url).replace (/^https?:\/\/www\.cnn\.com\/videos?(\/#\/video)?\//i, "");

        return {
                href: "//fave.api.cnn.io/v1/fav/?customer=cnn&env=prod&video=" + path,
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 416 / 234
            };
    },

    tests: [{
        noFeeds: true
    },
        "http://www.cnn.com/videos/world/2015/06/05/orig-200-pound-ripped-kangaroo-crushes-metal-video.cnn",
        "http://edition.cnn.com/videos/tv/2015/10/30/spc-the-circuit-felipe-massa-versus-felipe-nasr.cnn",
        "http://edition.cnn.com/video/shows/anthony-bourdain-parts-unknown/season-3/mexico/index.html",
        "http://www.cnn.com/video/shows/anthony-bourdain-parts-unknown/season-2/copenhagen/index.html",
        "http://www.cnn.com/videos/health/2017/03/14/iceland-genes-disease-research-health-sje-mobile-orig.cnn"
    ]
};
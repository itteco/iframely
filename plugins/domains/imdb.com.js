module.exports = {

    re: [
        /^https?:\/\/www\.imdb\.com\/video\/[\w]+\/vi(\d+)/i
    ],    

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "description",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch, options) {

        var width = options.maxWidth || 480;

        if (width < 400) {
            width = 400;
        }

        return {
            href: "http://www.imdb.com/video/imdb/vi" + urlMatch[1] + "/imdb/embed?autoplay=false&width=" + width,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            width: width,
            height: width / (16/9) + 40 // 40px body margin
        };
    },

    tests: [
        "http://www.imdb.com/video/epk/vi1061203225/",
        "http://www.imdb.com/video/imdb/vi2792795161?ref_=tt_pv_vi_aiv_2"
    ]
};
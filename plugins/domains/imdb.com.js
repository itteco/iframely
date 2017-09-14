module.exports = {

    re: [
        /^https?:\/\/www\.imdb\.com\/video\/[\w]+\/vi(\d+)/i,
        /^https?:\/\/www\.imdb\.com\/videoplayer\/vi(\d+)/i,        
        /^https?:\/\/www\.imdb\.com\/title\/\w{2}[\d]+\/?[^\/#]+#\w{2}\-vi(\d+)$/i
    ],    

    mixins: [
        "*"
    ],

    getLink: function(url, urlMatch, options) {

        if (/^https?:\/\/www\.imdb\.com\/video\/screenplay\/vi(\d+)/i.test(url)) {
            return;
        }

        var width = options.maxWidth || 480;

        if (width < 400) {
            width = 400;
        }

        return {
            href: "//www.imdb.com/video/imdb/vi" + urlMatch[1] + "/imdb/embed?autoplay=false&width=" + width,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            width: width,
            height: width / (16/9),
            scrolling: 'no'
        }
    },

    tests: [
        "http://www.imdb.com/video/epk/vi1061203225/",
        "http://www.imdb.com/video/imdb/vi2792795161?ref_=tt_pv_vi_aiv_2",
        "http://www.imdb.com/title/tt2937696/?ref_=ext_shr_tw_vi_tt_ov_vi#lb-vi1383576089",
        "http://www.imdb.com/videoplayer/vi2792795161?ref_=tt_pv_vi_aiv_2"
    ]
};
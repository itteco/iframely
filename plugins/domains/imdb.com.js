export default {

    re: [
        /^https?:\/\/www\.imdb\.com\/video\/(?:[\w]+\/)?vi(\d+)/i,
        /^https?:\/\/www\.imdb\.com(?:\/(?:title|list|name)\/\w{2}[\d]+)?\/videoplayer\/vi(\d+)/i,        
        /^https?:\/\/www\.imdb\.com\/title\/\w{2}[\d]+\/?[^\/#]+#\w{2}\-vi(\d+)$/i
    ],    

    mixins: [
        "*"
    ],

    getLink: function(url, urlMatch, options) {

        if (/^https?:\/\/www\.imdb\.com\/video\/screenplay\/vi(\d+)/i.test(url)) {
            return;
        }

        return {
            href: "https://www.imdb.com/videoembed/vi" + urlMatch[1],
            accept: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            'aspect-ratio': 16/9
        }
    },

    tests: [
        "https://www.imdb.com/video/epk/vi1061203225/",
        "https://www.imdb.com/video/imdb/vi2792795161?ref_=tt_pv_vi_aiv_2",
        "https://www.imdb.com/title/tt2937696/?ref_=ext_shr_tw_vi_tt_ov_vi#lb-vi1383576089",
        "https://www.imdb.com/videoplayer/vi2792795161?ref_=tt_pv_vi_aiv_2",
        "https://www.imdb.com/title/tt2177461/videoplayer/vi3236084505",
        "https://www.imdb.com/list/ls053181649/videoplayer/vi2588392217",
        "https://www.imdb.com/video/vi3064772121"
    ]
};
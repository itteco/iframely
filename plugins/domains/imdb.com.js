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

    getLink: function(urlMatch) {

        return {
            href: "http://www.imdb.com/video/imdb/vi" + urlMatch[1] + "/imdb/embed?autoplay=false&width=480",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            width: 480,
            height: 270
        }
    },

    tests: [
        "http://www.imdb.com/video/epk/vi1061203225/",
        "http://www.imdb.com/video/imdb/vi2792795161?ref_=tt_pv_vi_aiv_2"
    ]
};
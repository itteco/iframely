module.exports = {

    re: /https?:\/\/issuu\.com\/[\w_.-]+\/docs\/([\w_.-]+)/i,

    mixins: [
        "oembed-icon",
        "oembed-thumbnail",
        "oembed-author",
        "oembed-title",
        "oembed-site"
    ],

    getLink: function (oembed) {

        if (!oembed.html) return;

        return {
            html: oembed.html.replace (/style=\"[^\"]+\"/i, ""),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline],
        }

    },

    tests: [
        "http://issuu.com/redbulletin.com/docs/the_red_bulletin_stratos_special_us",
        "http://issuu.com/ukrainian_defense_review/docs/udr_02_2013_english",
        "http://issuu.com/jurnal11/docs/atlas171_jurnalik.ru",
        "http://issuu.com/kathamagazine/docs/julyaug2014/c/s8fjq65"
    ]

};
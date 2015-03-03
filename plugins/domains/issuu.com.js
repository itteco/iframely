module.exports = {

    re: /https?:\/\/issuu\.com\/[\w_.-]+\/docs\/([\w_.-]+)/i,

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-title",
        "oembed-site"
    ],

    getLink: function (oembed) {

        if (!oembed.html) {
            return;
        }

        return [{
            html: oembed.html.replace (/style=\"[^\"]+\"/i, ""),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline, CONFIG.R.ssl]
        }, {
            href: "http://issuu.com/apple-touch-icon-76x76@2x.png",
            rel: [CONFIG.R.icon],
            type: CONFIG.T.image_png,
            width: 152,
            height: 152
        }];

    },

    tests: [
        "http://issuu.com/redbulletin.com/docs/the_red_bulletin_stratos_special_us",
        "http://issuu.com/ukrainian_defense_review/docs/udr_02_2013_english",
        "http://issuu.com/kathamagazine/docs/julyaug2014/c/s8fjq65"
    ]

};
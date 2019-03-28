module.exports = {

    re: /https?:\/\/issuu\.com\/[\w_.-]+\/docs\/([\w_.-]+)/i,

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-title",
        "oembed-site",
        "oembed-description",
        // "og-video",
        'domain-icon'
    ],

    getLink: function (oembed) {

        if (!oembed.html) {
            return;
        }

        // let's make it responsive
        var html = oembed.html.replace (/style=\"[^\"]+\"/i, 'style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"'); 
        var aspect = 4/3;
        html = '<div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: ' +
            Math.round(1000 * 100 / aspect) / 1000
            + '%;">' + html + '</div>';
        
        return {
            html: html,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5],
            "aspect-ratio": aspect
        };

    },

    tests: [
        "http://issuu.com/redbulletin.com/docs/the_red_bulletin_stratos_special_us",
        "http://issuu.com/ukrainian_defense_review/docs/udr_02_2013_english",
        "http://issuu.com/kathamagazine/docs/julyaug2014/c/s8fjq65"
    ]

};
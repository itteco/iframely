var crypto = require('crypto');

function short_hash(value) {
    return crypto.createHash('md5').update(value).digest("hex").slice(0, 5);
}

module.exports = {

    re: [
        /^https?:\/\/m\.mlb\.com\/video\/topic\/(\d+)\/v(\d+)\//,        
        /^https?:\/\/m\.mlb\.com\/\w+\/video\/topic\/\w+\/v?(\d+)/,

    ],    

    mixins: [
        "*"
    ],

    getLink: function(og, url, urlMatch) {


        if (og.type == "video") {

            var topic_id = urlMatch[1];
            var content_id = urlMatch[2];

            if (!urlMatch[2]) {
                topic_id = (og.video.url || og.video).match(/topic_id=(\d+)/)[1];
                content_id = urlMatch[1];
            }
            var aspect = 400 / 224;
            if (og.video && og.video.width && og.video.height) {
                aspect = og.video.width / og.video.height;
            }

            aspect = Math.round(25 / 14 * 10000) / 10000;

            return {
                template_context: {
                    id: short_hash(url),
                    src: "https://securea.mlb.com/shared/video/embed/embed.html?content_id=" + content_id + "&topic_id=" + topic_id + "&property=mlb&",
                    aspect: aspect
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                "aspect-ratio": aspect
            }
        }
    },

    tests: [
        "http://m.mlb.com/video/topic/33521662/v499312583/marcia-gay-harden-joins-express-written-consent",
        "http://m.mlb.com/video/topic/6479266/v480941083/chcpit-lester-starts-rundown-to-nab-marte-stealing",
        "http://m.braves.mlb.com/atl/video/v817982083/cinatl-inciarte-plates-smith-on-rbi-double/?partnerId=as_atl_20160615_62794946&adbid=743228864080424961&adbpl=tw&adbpr=21436663"
    ]
};
var crypto = require('crypto');
var URL = require("url");

function short_hash(value) {
    return crypto.createHash('md5').update(value).digest("hex").slice(0, 5);
}

module.exports = {

    re: [
        /^https?:\/\/m\.mlb\.com\/video\/topic\/(\d+)\/v(\d+)\//i,        
        /^https?:\/\/m\.mlb\.com\/\w+\/video\/topic\/\w+\/v?(\d+)/i,
        /^https?:\/\/m\.mlb\.com\/(?:video\/)?v(\d+)\/?/i
    ],    

    mixins: [
        "*"
    ],

    getLink: function(og, url, urlMatch) {


        if (og.type == "video") {

            var flash = URL.parse(og.video.url || og.video,true);
            var query = flash.query;

            var topic_id = query.topic_id;
            var content_id = query.content_id;
            var property = query.property || 'mlb';
            var width = query.width || og.video.width;
            var height = query.height || og.video.height;

            if (content_id && topic_id && width && height) {

                var aspect = Math.round(width / height * 10000) / 10000;

                return {
                    template_context: {
                        id: short_hash(url),
                        src: "https://securea.mlb.com/shared/video/embed/embed.html?content_id=" + content_id + "&topic_id=" + topic_id + "&property=" + property + '&',
                        aspect: aspect
                    },
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                    "aspect-ratio": aspect
                }
            }
        }
    },

    tests: [
        "http://m.mlb.com/video/topic/33521662/v499312583/marcia-gay-harden-joins-express-written-consent",
        "http://m.mlb.com/video/topic/6479266/v480941083/chcpit-lester-starts-rundown-to-nab-marte-stealing",
        "http://m.braves.mlb.com/atl/video/v817982083/cinatl-inciarte-plates-smith-on-rbi-double/?partnerId=as_atl_20160615_62794946&adbid=743228864080424961&adbpl=tw&adbpr=21436663",
        "http://m.mlb.com/video/v1315346883/?game_pk=490375"
    ]
};
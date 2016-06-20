module.exports = {

    re: [
        /^https?:\/\/m\.mlb\.com\/video\/topic\/(\d+)\/v(\d+)\//,        
        /^https?:\/\/m\.mlb\.com\/\w+\/video\/topic\/\w+\/v?(\d+)/,

    ],    

    mixins: [
        "*"
    ],

    getLink: function(og, urlMatch, options) {


        if (og.type == "video") {

            var topic_id = urlMatch[1];
            var content_id = urlMatch[2];
            var width = options.maxWidth || 600;
            var height = options.maxWidth ? options.maxWidth / (600/336) : 336;

            if (!urlMatch[2]) {
                topic_id = (og.video.url || og.video).match(/topic_id=(\d+)/)[1];
                content_id = urlMatch[1];
            }

            return {
                href: "https://securea.mlb.com/shared/video/embed/embed.html?content_id=" + content_id + "&topic_id=" + topic_id + "&width=" + width + "&height=" + height + "&property=mlb",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                width: width,
                height: height
            }
        }
    },

    tests: [
        "http://m.mlb.com/video/topic/33521662/v499312583/marcia-gay-harden-joins-express-written-consent",
        "http://m.mlb.com/video/topic/6479266/v480941083/chcpit-lester-starts-rundown-to-nab-marte-stealing",
        "http://m.braves.mlb.com/atl/video/v817982083/cinatl-inciarte-plates-smith-on-rbi-double/?partnerId=as_atl_20160615_62794946&adbid=743228864080424961&adbpl=tw&adbpr=21436663"
    ]
};
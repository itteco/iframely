module.exports = {

    re: /^https?:\/\/m\.mlb\.com\/video\/topic\/(\d+)\/v(\d+)\//,

    mixins: [
        "*"
    ],

    getLink: function(og, urlMatch) {
        if (og.type == "video") {
            return {
                href: "https://securea.mlb.com/shared/video/embed/embed.html?content_id=" + urlMatch[2] + "&topic_id=" + urlMatch[1] + "&width=600&height=336&property=mlb",                
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                width: 600,
                height: 336
            }
        }
    },

    tests: [
        "http://m.mlb.com/video/topic/33521662/v499312583/marcia-gay-harden-joins-express-written-consent",
        "http://m.mlb.com/video/topic/6479266/v480941083/chcpit-lester-starts-rundown-to-nab-marte-stealing"
    ]
};
export default {

    re: [
        /^https?:\/\/(?:www|pro)\.beatport\.com\/(track|mix)\/[a-zA-Z0-9\.\-]+\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(og, urlMatch) {
        return [{
            href: "//embed.beatport.com/player/?id=" + urlMatch[2] + "&type=" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            height: og.video && og.video.height || 162,
            'min-width': og.video && og.video.width || 398
        }, {
            href: og.video && og.video.secure_url.replace(/(auto)=1/i, '$1=0'),
            type: og.video && og.video.type || CONFIG.T.text_html,
            rel: CONFIG.R.player,
            height: og.video && og.video.height,
            'min-width': og.video && og.video.width
        }, {
            href: "https://www.beatport.com/favicon.ico",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        }];
    },

    tests: [{
        page: "http://www.beatport.com/",
        selector: "a.top-ten-track-title"
    },
        "http://www.beatport.com/track/kiss-bitches-original-mix/5374571"
    ]
};
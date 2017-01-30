module.exports = {

    re: [
        /^https?:\/\/([a-z]+\.)?([a-z]+\.)?\w+\/watch\/[a-zA-Z0-9]+/i
    ],

    provides: "__isVidyard",

    mixins: [
        "*"
    ],

    getLinks: function(__isVidyard, twitter) {

        if (/^https:\/\/play\.vidyard\.com\//i.test(twitter && twitter.player && twitter.player.value)) {

            return [{
                href: twitter.player.value,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                'aspect-ratio': twitter.player.width / twitter.player.height,
                autoplay: "autoplay=1"
            }, {
                href: twitter.player.stream,
                type: CONFIG.T.mp4,
                rel: CONFIG.R.player,
                'aspect-ratio': twitter.player.width / twitter.player.height                
            }];
        }

    },

    getData: function(meta) {
        if (meta.generator === 'vidyard.com' && meta.og && meta.og.site_name === 'Vidyard') {
            return {
                __isVidyard: true
            }
        }
    },

    tests: [
        "http://videos.coupa.com/watch/AwIyk21Eb4KvHt0vZVYXDA",
        "http://videos.coupa.com/watch/PM55tsBoZ3yXDyUhz82aHG",
        "http://video.sencha.com/watch/a2v2Jjy6USsfYXxovNPzVD",
        "http://videos.zignallabs.com/watch/CJb9FicSup-0WgTQE_7RHQ",
        "http://videos.tenable.com/watch/vPyeFncWD-hDT9Yzt8H92g",
        "https://videos.mulesoft.com/watch/CMvECRRnLFGhRrxRtbsJnD", 
        "http://video.verint.com/watch/yeGzTrpJ6lIPGYyx-i4aYw"
    ]
};
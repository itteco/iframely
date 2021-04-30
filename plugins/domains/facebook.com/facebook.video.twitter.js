module.exports = {

    provides: "__allowFBThumbnail",

    re: require('./facebook.video').re,

    getLink: function(url, __allowFBThumbnail, twitter) {
        if (twitter.player && twitter.player.width && twitter.player.height) {
            return {
                href: twitter.player.value,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                'aspect-ratio': twitter.player.width / twitter.player.height
            }
        }
    }
};
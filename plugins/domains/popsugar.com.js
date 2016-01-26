module.exports = {
 
    mixins: ["*"],

    getLink: function (twitter) {

        if (twitter.player && twitter.player.stream) {
            return {
                href: (twitter.player.stream.value || twitter.player.stream).replace(/^https:\/\//, 'http://'), //https has broken redirects
                rel: CONFIG.R.player,
                type: CONFIG.T.maybe_text_html, // verify that it is ok
                'aspect-ratio': 16/9
            }
        }
    },

    tests: [
        "http://www.popsugar.com/home/House-Hunters-Spoof-Video-38029585",
        "http://www.popsugar.com/celebrity/Viola-Davis-Sexual-Assault-Speech-Video-39127511"
    ]
};
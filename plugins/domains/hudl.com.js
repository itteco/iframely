module.exports = {

    re: [
        /^https?:\/\/www\.hudl\.com\/(athlete\/\d+\/highlights\/\d+)/i,
        /^https?:\/\/www\.hudl\.com\/(video\/[0-9a-zA-Z\/]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, og) {

        if (og.video) {
            return {
                href: '//www.hudl.com/embed/' + urlMatch[1],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                'aspect-ratio': 640/360
            };
        }
    },

    tests: [
        "http://www.hudl.com/athlete/4927189/highlights/309644377",
        "http://www.hudl.com/video/3/4927189/5721d64c4df6124b70241827",
        "http://www.hudl.com/v/Tqusi"
    ]
};
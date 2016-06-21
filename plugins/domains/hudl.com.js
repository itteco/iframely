module.exports = {

    re: /^https?:\/\/www\.hudl\.com\/(athlete\/\d+\/highlights\/\d+)/i,    

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
        "http://www.hudl.com/v/Tqusi"
    ]
};
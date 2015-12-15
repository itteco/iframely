module.exports = {

    re: [
        /^https?:\/\/www\.cbc\.ca\/player\//i,        
    ],

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (!twitter.player || !twitter.player.value) {
            return;
        }

        var href = twitter.player.value.replace(/^https:\/\//, 'http://'); // autoPlay = true will be removed by generic validators

        return {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": twitter.player.width / twitter.player.height
            };
    },

    tests: [
        "http://www.cbc.ca/player/play/2558388650",
        "http://www.cbc.ca/player/Shows/Shows/Dragons+Den/ID/2558469970/"
    ]
};
module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.player && twitter.player.value) {

            var playlist = twitter.player.value.match(/playlist=\/(\w+\/[a-zA-Z0-9-]+\-\d+)\w?&/);

            if (playlist) {                
                
                return [{
                    href: "http://www.bbc.com/" + playlist[1] + '/embed',
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    type: CONFIG.T.text_html,
                    "aspect-ratio": 16/9,
                    'padding-bottom': 225, 
                    scrolling: 'no'
                }, {
                    href: "https://ssl.bbc.co.uk/" + playlist[1] + '/embed',
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    type: CONFIG.T.text_html,
                    "aspect-ratio": 16/9,
                    'padding-bottom': 225, 
                    scrolling: 'no'
                }]
            }
        }
    },

    tests: [
        "http://www.bbc.com/news/science-environment-23767323",
        "http://www.bbc.com/mundo/media-36726262",
        "http://www.bbc.com/news/business-35324289"
    ]
};
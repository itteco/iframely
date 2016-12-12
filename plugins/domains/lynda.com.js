module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(cheerio) {
        var $tag = cheerio('[data-initial-video-id]');
        if ($tag.length) {
            var id = $tag.attr('data-initial-video-id');
            return {
                href: 'https://www.lynda.com/player/embed/' + id + '?fs=3&w=560&h=315&ps=paused&utm_medium=referral&utm_source=embed+video&utm_campaign=ldc-website&utm_content=vid-' + id,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.playerjs],
                type: CONFIG.T.text_html,
                "aspect-ratio": 560 / 315
            };
        }
    },

    tests: [{
        page: 'https://www.lynda.com/',
        selector: '.card-meta-data a'
    },
        "https://www.lynda.com/Illustrator-tutorials/Pixel-Playground/122998-2.html"
    ]
};
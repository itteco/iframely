module.exports = {

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-description",
        "keywords",
        "twitter-title",
        "twitter-site"
    ],

    getLink: function(cheerio) {
        var $player = cheerio('#player-container');
        if ($player.length) {
            var guid = $player.attr('data-video-guid');
            var feed = $player.attr('data-feed-url');

            return {
                href: 'http://player.d.nationalgeographic.com/players/ngsvideo/share/?feed=' + feed + '&guid=' + guid + '&link=http://video.nationalgeographic.com/video/',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                'aspect-ratio': 863/495
            };
        }
    },

    tests: [{
        page: "http://video.nationalgeographic.com/",
        selector: 'a.video'
    }, {
        skipMixins: ['keywords']
    },
        "http://video.nationalgeographic.com/video/magazine/ngm-war-dogs-layka"
    ]
};
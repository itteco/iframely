module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(cheerio) {
        var $player = cheerio('#player-container');
        if ($player.length) {
            var guid = $player.attr('data-guid');

            if (guid) {
                return {
                    href: 'https://assets.nationalgeographic.com/modules-video/assets/ngsEmbeddedVideo.html?guid=' + guid,                
                    accept: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    'aspect-ratio': 640/365
                };
            }
        }
    },

    tests: [{
        page: "http://video.nationalgeographic.com/",
        selector: 'a.video'
    },
        "http://video.nationalgeographic.com/video/magazine/ngm-war-dogs-layka"
    ]
};
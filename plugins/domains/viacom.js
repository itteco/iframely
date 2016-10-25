module.exports = {

    re: [        
        /https?:\/\/\w+\.(cc|mtv|spike)\.com\/video\-(clips|collections|playlists)\//i
    ],

    mixins: ["*"],

    getLink: function(cheerio) {        

        var $player = cheerio('.video_player[data-mgid*="mgid:arc:video:"]');
        
        if ($player.length) {
            return {
                href: "http://media.mtvnservices.com/embed/" + $player.attr('data-mgid'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player,  CONFIG.R.html5],
                "aspect-ratio": 512 / 288

            }
        }
    },

    tests: [
        "http://www.cc.com/video-clips/4hfvws/the-daily-show-with-trevor-noah-jon-stewart-returns-to-shame-congress",
        "http://www.cc.com/video-collections/igf7f1/the-daily-show-with-jon-stewart-jon-s-final-episode/bjutn7?xrs=share_copy_email",
        "http://www.mtv.com/video-clips/clur1b/are-you-the-one-deleted-scene-austin-and-kayla-get-muddy",
        "http://bellator.spike.com/video-clips/1uo4tc/bellator-162-what-to-watch-shlemenko-vs-grove",
        "http://www.spike.com/video-clips/xbz35t/bar-rescue-barstool-sports-on-bar-rescue"
    ]
};
module.exports = {

    re: [        
        /https?:\/\/www\.cc\.com\/video\-(clips|collections)\//i
    ],

    mixins: ["*"],

    getLink: function(sm4, cheerio) {

        if (sm4.type && /video/i.test(sm4.type)) {

            var $player = cheerio('.video_player[data-mgid*="mgid:arc:video:comedycentral.com"]');
        
            if ($player.length) {
                return {
                    href: "http://media.mtvnservices.com/embed/" + $player.attr('data-mgid'),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player,  CONFIG.R.html5],
                    "aspect-ratio": 512 / 288

                }
            }
        }
    },

    tests: [
        "http://www.cc.com/video-clips/4hfvws/the-daily-show-with-trevor-noah-jon-stewart-returns-to-shame-congress",
        "http://www.cc.com/video-collections/igf7f1/the-daily-show-with-jon-stewart-jon-s-final-episode/bjutn7?xrs=share_copy_email"
    ]
};
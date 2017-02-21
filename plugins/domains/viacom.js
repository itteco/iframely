module.exports = {

    re: [        
        /https?:\/\/\w+\.(cc|mtv|logotv)\.com\/video\-(clips|collections|playlists)\//i
    ],

    mixins: ["*"],

    getLink: function(og, cheerio) {

        var mgid;

        if (og.video && og.video.url && /^https?:\/\/media\.mtvnservices\.com\/fb\/(mgid:arc:video:[0-9a-zA-Z:\._\-]+)\.swf$/i.test(og.video.url)) {
            mgid = og.video.url.match(/^https?:\/\/media\.mtvnservices\.com\/fb\/(mgid:arc:video:[0-9a-zA-Z:\._\-]+)\.swf$/i)[1];
        } else {
            var $player = cheerio('.video_player[data-mgid*="mgid:arc:video:"]');
            mgid = $player.attr('data-mgid');
        }
        
        if (mgid) {
            return [{
                href: "http://media.mtvnservices.com/embed/" + mgid,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player,  CONFIG.R.html5],
                "aspect-ratio": 512 / 288
            }]            
        }
    },

    tests: [
        "http://www.cc.com/video-clips/4hfvws/the-daily-show-with-trevor-noah-jon-stewart-returns-to-shame-congress",
        "http://www.cc.com/video-collections/igf7f1/the-daily-show-with-jon-stewart-jon-s-final-episode/bjutn7?xrs=share_copy_email",
        "http://www.mtv.com/video-clips/u0fu3h/vma-2016-teyana-taylor-on-my-super-sweet-16",
        "http://www.mtv.com/video-clips/7zcf54/vma-2016-britney-spears-make-me-me-myself-i-ft-g-eazy-live-performance-vma-2016-mtv"
        // "http://www.logotv.com/video-playlists/rlxfkb/rupauls-all-stars-drag-race-the-final-lap-all-stars-supergroup/xpkvdc"
    ]
};
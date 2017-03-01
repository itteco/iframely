module.exports = {

    re: [        
        /https?:\/\/\w+\.(cc|mtv|logotv)\.com\/video\-(clips|collections|playlists)\//i
    ],

    mixins: ["*"],

    getLink: function(meta, cheerio) {

        var mgid;

        if (meta.og && meta.og.video && meta.og.video.url && /^https?:\/\/media\.mtvnservices\.com\/fb\/(mgid:arc:video:[0-9a-zA-Z:\._\-]+)\.swf$/i.test(meta.og.video.url)) {
            mgid = meta.og.video.url.match(/^https?:\/\/media\.mtvnservices\.com\/fb\/(mgid:arc:video:[0-9a-zA-Z:\._\-]+)\.swf$/i)[1];

        } else if (meta['apple-itunes-app'] && /\/\/video\/[0-9a-zA-Z:\._\-]+$/i.test(meta['apple-itunes-app']) && meta.og && /\w+\.com\//.test(meta.og.image)) {
            mgid = 'mgid:arc:video:' + meta.og.image.match(/(\w+\.com)\//i)[1] + ':'+ meta['apple-itunes-app'].match(/\/\/video\/([0-9a-zA-Z:\._\-]+)$/i)[1];            

        } else {
            var $player = cheerio('.video_player[data-mgid*="mgid:arc:video:"]');
            mgid = $player.attr('data-mgid');
        }
        
        if (mgid) {
            return [{
                href: "http://media.mtvnservices.com/embed/" + mgid, // they suggest //media.. on the site, but HTTPs still doesn't actually work
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player,  CONFIG.R.html5],
                "aspect-ratio": 512 / 288
            }]            
        }
    },

    getData: function(url, og, options, cb) {

        if (og.url && og.url !== url &&
            (!options.redirectsHistory || options.redirectsHistory.indexOf(og.url) === -1)) {

            cb ({
                redirect: og.url
            });            

        } else {
            cb(null);
        }
    },    

    tests: [
        {
            skipMethods: [
                "getData"
            ]
        },
        "http://www.cc.com/video-clips/4hfvws/the-daily-show-with-trevor-noah-jon-stewart-returns-to-shame-congress",
        "http://www.cc.com/video-collections/igf7f1/the-daily-show-with-jon-stewart-jon-s-final-episode/bjutn7?xrs=share_copy_email",
        "http://www.mtv.com/video-clips/u0fu3h/vma-2016-teyana-taylor-on-my-super-sweet-16",
        "http://www.mtv.com/video-clips/7zcf54/vma-2016-britney-spears-make-me-me-myself-i-ft-g-eazy-live-performance-vma-2016-mtv"
        // "http://www.logotv.com/video-playlists/rlxfkb/rupauls-all-stars-drag-race-the-final-lap-all-stars-supergroup/xpkvdc"
    ]
};
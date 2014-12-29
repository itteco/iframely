var cheerio = require('cheerio');

module.exports = {

    getLink: function(oembed, whitelistRecord) {


        if (!(oembed.type === "video" && whitelistRecord && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video'))) {
            return;
        }

        var player = {
            type: CONFIG.T.text_html,  // Always an iframe, either native, or hosted
            rel:[CONFIG.R.oembed, CONFIG.R.player]
        };


        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {
            player.href = $iframe.attr('src');

            if (whitelistRecord && whitelistRecord.isAllowed('oembed.video', 'ssl')) {
                player.href = player.href.replace(/^http:\/\//i, '//');
            }

        } else { 
            player.html = oembed.html || oembed.html5; // will render in an iframe
        }


        if (whitelistRecord.isAllowed('oembed.video', 'responsive')) {
            player['aspect-ratio'] = oembed.width / oembed.height;
        } else {
            player.width = oembed.width;
            player.height = oembed.height
        }

        if (whitelistRecord.isAllowed('oembed.video', 'autoplay')) {
            player.rel.push(CONFIG.R.autoplay);
        }

        return player;

    },

    getMeta: function(oembed) {

        if (oembed.type === "video" || oembed.type === "audio") {
            return {
                media: "player"
            };
        }
    },


    // tests are only applicable with the whitelist, otherwise will throw errors on Test UI
    /*
    tests: [
        "http://sports.pixnet.net/album/video/183041064", 
        "http://video.yandex.ua/users/enema-bandit/view/11/?ncrnd=4917#hq"
    ]
    */
};
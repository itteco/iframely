var cheerio = require('cheerio');
var entities = require('entities');

module.exports = {

    getLink: function(oembed, whitelistRecord) {


        if (!(oembed.type === "video" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video'))) {
            return;
        }

        var player = {
            type: CONFIG.T.text_html,  // Always an iframe, either native, or hosted
            rel:[CONFIG.R.oembed, CONFIG.R.player]
        };

        // allow encoded entities if they start from $lt; and end with &gt;
        var html = oembed.html5 || oembed.html; 
        if (/^&lt;.*&gt;$/i.test(html)) {
            html = entities.decodeHTML(html);
        }


        var $container = cheerio('<div>');
        try {
            $container.html(html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {
            player.href = $iframe.attr('src');

            if (whitelistRecord.isAllowed('oembed.video', 'ssl')) {
                player.href = player.href.replace(/^http:\/\//i, '//');
            }

        } else { 
            player.html = html; // will render in an iframe
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

    highestPriority: true,

    getMeta: function(oembed, whitelistRecord) {

        if (oembed.type === "video" || oembed.type === "audio"
            || (oembed.type === "rich" && !whitelistRecord.isDefault && whitelistRecord.isAllowed('oembed.rich') && whitelistRecord.isAllowed('oembed.rich', "player")) ) {
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
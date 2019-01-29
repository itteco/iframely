var cheerio = require('cheerio');
var entities = require('entities');

module.exports = {

    getLink: function(oembed, whitelistRecord) {        


        if (!(oembed.type === "video" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video'))) {
            return;
        }

        var player = {
            rel:[CONFIG.R.oembed, CONFIG.R.player]
        };


        // allow encoded entities if they start from $lt;
        // ex.: http://www.nfb.ca/film/wild_life/
        var html = oembed.html5 || oembed.html; 
        if (/^&lt;/i.test(html)) {
            html = entities.decodeHTML(html);
        }

        var $container = cheerio('<div>');
        try {
            $container.html(html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1 && $iframe.attr('src')) {
            player.href = $iframe.attr('src');

            if (whitelistRecord.isAllowed('oembed.video', 'ssl')) {
                player.href = player.href.replace(/^http:\/\//i, '//');
            }
            if (/\.mp4(\?[^\?\/]+)?$/i.test(player.href)) {
                player.accept = [CONFIG.T.text_html, CONFIG.T.video_mp4]
            } else {
                player.type = CONFIG.T.text_html;
            }

        } else { 
            player.html = html; // will render in an iframe
            player.type = CONFIG.T.text_html;
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

        if (whitelistRecord.oembed && whitelistRecord.oembed['video-autoplay']) {
            player.autoplay = whitelistRecord.oembed['video-autoplay'];
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
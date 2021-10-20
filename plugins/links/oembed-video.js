import cheerio_pkg from 'cheerio';
const cheerio = cheerio_pkg.default;
import * as entities from 'entities';

export default {

    getLink: function(oembed, whitelistRecord, url) {

        if (!(oembed.type === "video" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video'))) {
            return;
        }

        var player = {
            rel:[CONFIG.R.oembed, CONFIG.R.player]
        };

        var iframe = oembed.getIframe();

        // if embed code contains <iframe>, return src
        if (iframe && iframe.src) {
            player.href = iframe.src;

            if (whitelistRecord.isAllowed('oembed.video', 'ssl')) {
                player.href = player.href.replace(/^http:\/\//i, '//');
            }
            // If iFrame is not SSL, 
            // But URL itself is same domain and IS ssl - fix the oEmbed ommission. 
            else if (url && /^http:\/\/([^\/]+)\//i.test(player.href)
                && url.match('https://' + player.href.match(/^http:\/\/([^\/]+)\//i[1]))
                ) {
                player.href = player.href.replace(/^http:\/\//i, '//');
            }

            if (/\.mp4(\?[^\?\/]+)?$/i.test(player.href)) {
                player.accept = [CONFIG.T.text_html, CONFIG.T.video_mp4]
            } else {
                player.type = CONFIG.T.text_html;
            }

        } else { 
            player.html = oembed.html; // will render in an iframe
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

        if (whitelistRecord.isAllowed('oembed.video', 'html5')) {
            player.rel.push(CONFIG.R.html5);
        }

        if (iframe && iframe.allow) {
            player.rel = player.rel.concat(iframe.allow.replace(/autoplay;?\s?\*?/ig, '').split(/\s?\*?;\s?\*?/g));
        }        

        return player;

    },

    getMeta: function(oembed, whitelistRecord) {

        if (!whitelistRecord.isAllowed('oembed.video') && (oembed.type === "video" || oembed.type === "audio")) {
            return {
                medium: oembed.type
            };
        }
    },


    // tests are only applicable with the whitelist, otherwise will throw errors on Test UI
    /*
    tests: [
        "http://sports.pixnet.net/album/video/183041064", 
    ]
    */
};
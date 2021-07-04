var _ = require("underscore");
var utils = require('./utils');

function getVideoLinks(video, whitelistRecord) {
    
    var width = whitelistRecord.isAllowed('og.video', 'rotate') ?  video.height : video.width;
    var height = whitelistRecord.isAllowed('og.video', 'rotate') ?  video.width : video.height;
    var accept = ['video/*', 'audio/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl];

    if (whitelistRecord.isAllowed('og.video', 'html5')) {
        accept.push (CONFIG.T.text_html);
    } else if (!whitelistRecord.isDefault) {
        accept.push (CONFIG.T.text_html);
    }

    var players = [];

    if (!whitelistRecord.isDefault || /\.(mp4|m4v|m3u8|mp3)/i.test(video.url || video) || /^video\//i.test(video.type)) {
        players.push({
            href: video.url || video,
            accept: accept,
            rel: [CONFIG.R.player, CONFIG.R.og],
            width: width,
            height: height
        });        
    }

    if (whitelistRecord.isAllowed('og.video', 'ssl') && video.secure_url) {
        players.push({
            href: video.secure_url,
            accept: accept,
            rel: [CONFIG.R.player, CONFIG.R.og],
            width: width,
            height: height
        });
    }

    if (whitelistRecord.isAllowed('og.video', 'iframe') && video.iframe) {
        players.push({
            href: video.iframe,
            accept: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.og],
            width: width,
            height: height
        });
    }

    return players;
}

module.exports = {

    getLinks: function(og, whitelistRecord) {

        if (og.video 
            && (whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video') 
                || !whitelistRecord.og && /\.(mp4|m3u8|mp3)/i.test(og.video.url || og.video)
                || !whitelistRecord.og && /^video\//i.test(og.video.type)) ) {

            if (og.video instanceof Array) {

                return utils.mergeMediaSize(_.flatten(og.video.map(function(video) {
                    return getVideoLinks(video, whitelistRecord);
                })));

            } else if (og.video) {

                return getVideoLinks(og.video, whitelistRecord);
            }
        }
    }
};
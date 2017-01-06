var _ = require("underscore");
var utils = require('./utils');

function getVideoLinks(video, whitelistRecord) {

    var width = whitelistRecord.isAllowed('og.video', 'rotate') ?  video.height : video.width;
    var height = whitelistRecord.isAllowed('og.video', 'rotate') ?  video.width : video.height;

    var players = [{
        href: video.url || video,
        type: CONFIG.T.maybe_text_html,
        rel: [CONFIG.R.player, CONFIG.R.og],
        width: width,
        height: height
    }];

    if (whitelistRecord.isAllowed('og.video', 'ssl') && video.secure_url) {
        players.push({
            href: video.secure_url,
            type: CONFIG.T.maybe_text_html,
            rel: [CONFIG.R.player, CONFIG.R.og],
            width: width,
            height: height
        });
    }

    if (whitelistRecord.isAllowed('og.video', 'iframe') && video.iframe) {
        players.push({
            href: video.iframe,
            type: CONFIG.T.maybe_text_html,
            rel: [CONFIG.R.player, CONFIG.R.og],
            width: width,
            height: height
        });
    }    

    return players;
}

module.exports = {

    getLinks: function(og, whitelistRecord) {

        if (og.video && whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video')) {

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
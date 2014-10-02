var _ = require("underscore");

function getVideoLinks(video) {

    return [{
        href: video.url || video,
        type: video.type || CONFIG.T.maybe_text_html,
        rel: [CONFIG.R.player, CONFIG.R.og],
        "aspect-ratio": video.width / video.height
    }, {
        href: video.secure_url,
        type: video.type || CONFIG.T.maybe_text_html,
        rel: [CONFIG.R.player, CONFIG.R.og],
        "aspect-ratio": video.width / video.height
    }];
}

module.exports = {

    getLinks: function(og) {

        if (og.video instanceof Array) {

            return _.flatten(og.video.map(getVideoLinks));

        } else if (og.video) {

            return getVideoLinks(og.video);
        }
    }
};
var _ = require("underscore");

var rel = [CONFIG.R.thumbnail, CONFIG.R.og];

function getImageLinks(image) {
    return [{
        href: image.url || image,
        type: image.type || CONFIG.T.image,
        rel: rel,
        width: image.width,
        height: image.height
    }, {
        href: image.secure_url,
        type: image.type || CONFIG.T.image,
        rel: rel,
        width: image.width,
        height: image.height
    }];
}

module.exports = {

    getLinks: function(og) {

        if (og.image instanceof Array) {

            return _.flatten(og.image.map(getImageLinks));

        } else if (og.image) {

            return getImageLinks(og.image);
        }
    }
};
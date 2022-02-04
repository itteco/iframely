import * as _ from "underscore";

var rel = [CONFIG.R.image, CONFIG.R.og];

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

export default {

    getLinks: function(og) {

        if (og.image instanceof Array) {

            return _.flatten(og.image.map(getImageLinks));

        } else if (og.image) {

            return getImageLinks(og.image);
        }
    }
};
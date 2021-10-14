import * as _ from "underscore";

var rel = [CONFIG.R.thumbnail, CONFIG.R.og];

function getImageLinks(image) {

    var images = [{
        href: image.url || image,
        type: image.type && /^image\//i.test(image.type) ? image.type : CONFIG.T.image,
        rel: rel,
        width: image.width,
        height: image.height
    }];

    if (image.secure_url) {
        images.push({
            href: image.secure_url,
            type: image.type && /^image\//i.test(image.type) ? image.type : CONFIG.T.image,
            rel: rel,
            width: image.width,
            height: image.height
        });
    }

    return images;
}

export default {

    getLinks: function(og) {

        if (og.image && og.image instanceof Array) {

            return _.flatten(og.image.map(getImageLinks));

        } else if (og.image) {

            return getImageLinks(og.image);
        }
    }
};
const rel = [CONFIG.R.image, CONFIG.R.og];

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

            return og.image.map(getImageLinks).flat();

        } else if (og.image) {

            return getImageLinks(og.image);
        }
    }
};
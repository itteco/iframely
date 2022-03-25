import * as _ from "underscore";

export function getImageLinks(image, rel) {

    var link = {
        href: image.url || image,
        type: image.type && /^image\//i.test(image.type) ? image.type : CONFIG.T.image,
        rel: [CONFIG.R.thumbnail, rel || CONFIG.R.og],
        width: image.width,
        height: image.height
    };

    if (image.secure_url) {
        var links = [{...link}];
        link.href = image.secure_url;
        links.push({...link});
        return links;
    } else {
        return [link];
    }
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
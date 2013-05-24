var _ = require("underscore");

module.exports = {

    getLinks: function(meta) {

        if (!meta.og)
            return;

        if (meta.og.image instanceof Array) {
            return _.flatten(meta.og.image.map(function(image) {
                return [{
                    href: image.url || image,
                    type: image.type || CONFIG.T.image,
                    rel: [CONFIG.R.thumbnail, CONFIG.R.og],
                    width: image.width,
                    height: image.height
                }, {
                    href: image.secure_url,
                    type: CONFIG.T.image,
                    rel: CONFIG.R.thumbnail,
                    width: image.width,
                    height: image.height
                }]
            }));
        } else if (meta.og.image) {
            return [{
                href: meta.og.image.url || meta.og.image,
                type: meta.og.image.type || CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.og],
                width: meta.og.image.width,
                height: meta.og.image.height
            }, {
                href: meta.og.image.secure_url,
                type: meta.og.image.type || CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.og],
                width: meta.og.image.width,
                height: meta.og.image.height
            }];
        }
    }
};
var _ = require("underscore");

module.exports = {

    getLinks: function(meta, whitelistRecord) {

        if (!meta.og)
            return;

        var rel;

        if ((!meta.twitter || !meta.twitter.image) && whitelistRecord.twitter && whitelistRecord.twitter.photo) {
            rel = [CONFIG.R.image, CONFIG.R.og, CONFIG.R.twitter];
        } else {
            rel = [CONFIG.R.thumbnail, CONFIG.R.og];
        }

        if (meta.og.image instanceof Array) {
            return _.flatten(meta.og.image.map(function(image) {
                return [{
                    href: image.url || image,
                    type: image.type || CONFIG.T.image,
                    rel: rel,
                    width: image.width,
                    height: image.height
                }, {
                    href: image.secure_url,
                    type: CONFIG.T.image,
                    rel: rel,
                    width: image.width,
                    height: image.height
                }]
            }));
        } else if (meta.og.image) {
            return [{
                href: meta.og.image.url || meta.og.image,
                type: meta.og.image.type || CONFIG.T.image,
                rel: rel,
                width: meta.og.image.width,
                height: meta.og.image.height
            }, {
                href: meta.og.image.secure_url,
                type: meta.og.image.type || CONFIG.T.image,
                rel: rel,
                width: meta.og.image.width,
                height: meta.og.image.height
            }];
        }
    },

    tests: [{
        pageWithFeed: "http://digg.com/"
    }, {
        skipMethods: [
            "getLinks"
        ]
    }]
};
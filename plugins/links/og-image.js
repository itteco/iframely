var _ = require("underscore");

module.exports = {

    getLinks: function(og, meta, whitelistRecord) {

        var rel;
        // TODO: make whitelistRecord.isAllowed always existing method?
        if (whitelistRecord && (meta.twitter && meta.twitter.card === "photo" && meta.twitter.image) && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.photo')) {
            rel = [CONFIG.R.image, CONFIG.R.og, CONFIG.R.twitter];
        } else {
            rel = [CONFIG.R.thumbnail, CONFIG.R.og];
        }

        if (og.image instanceof Array) {
            return _.flatten(og.image.map(function(image) {
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
        } else if (og.image) {
            return [{
                href: og.image.url || og.image,
                type: og.image.type || CONFIG.T.image,
                rel: rel,
                width: og.image.width,
                height: og.image.height
            }, {
                href: og.image.secure_url,
                type: og.image.type || CONFIG.T.image,
                rel: rel,
                width: og.image.width,
                height: og.image.height
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
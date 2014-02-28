var _ = require('underscore');

module.exports = {

    notPlugin: true,

    getImageLink: function(attr, meta) {
        var v = meta[attr];
        if (!v) {
            return;
        }
        if (v instanceof Array) {
            return v.map(function(image) {
                return {
                    href: image.href || image,
                    type: image.type || CONFIG.T.image,
                    rel: CONFIG.R.thumbnail
                }
            });
        } else {
            return {
                href: v.href || v,
                type: v.type || CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            };
        }
    },

    parseMetaLinks: function(key, value) {

        var rels = key.split(/\W+/);

        if (_.intersection(rels, CONFIG.REL_GROUPS).length == 0) {
            return [];
        }

        // TODO: add media and rels to faviicon and thumbnail plugins.
        var EXISTING_PROVIDERS = ["icon", "thumbnail"];

        if (rels.length == 1 && _.intersection(rels, EXISTING_PROVIDERS).length > 0) {
            return [];
        }

        if (typeof value === "string") {
            return [{
                href: value,
                rel: rels
            }];
        }

        if (typeof value !== "object") {
            return [];
        }

        if (!(value instanceof Array)) {
            value = [value];
        }

        var links = [];

        value.forEach(function(v) {

            var link = {
                href: v.href,
                title: v.title,
                type: v.type,   // Validate TYPE?
                rel: rels       // Validate REL?
            };

            var media = v.media;
            if (media) {
                CONFIG.MEDIA_ATTRS.forEach(function(ma) {
                    var re = "\\(\\s*" + ma + "\\s*:\\s*([\\d./:]+)(?:px)?\\s*\\)";
                    var m = media.match(re);
                    if (m) {
                        link[ma] = m[1];
                    }
                });
            }

            links.push(link);
        });

        return links;
    }
};

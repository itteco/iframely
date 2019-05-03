var _ = require('underscore');

var ALLOWED_TYPES = {};

_.values(CONFIG.T).forEach(function(v) {
    ALLOWED_TYPES[v] = true;
});

module.exports = {

    notPlugin: true,

    mergeMediaSize: function(links) {

        if (links && links instanceof Array) {

            // Search first link with media.

            var media = null,
                i = 0;

            while(!media && i < links.length) {

                var link = links[i];

                // Get all media attrs from link (if has).
                for(var j = 0; j < CONFIG.MEDIA_ATTRS.length; j++) {
                    var attr = CONFIG.MEDIA_ATTRS[j];
                    if (link[attr]) {
                        if (!media) {
                            media = {};
                        }
                        media[attr] = link[attr];
                    }
                }
                i++;
            }

            if (media) {

                i = 0;

                while(i < links.length) {

                    var hasMedia = false,
                        link = links[i];

                    for(var j = 0; !hasMedia && j < CONFIG.MEDIA_ATTRS.length; j++) {
                        var attr = CONFIG.MEDIA_ATTRS[j];
                        if (link[attr]) {
                            hasMedia = true;
                        }
                    }

                    if (!hasMedia) {
                        _.extend(link, media);
                    }

                    i++;
                }
            }
        }

        return links;
    },

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

    parseMetaLinks: function(key, value, whitelistRecord) {

        if (typeof value !== "object" || typeof value === "string") {
            return [];
        }

        var rels = key.split(/\W+/);
        if (_.intersection(rels, CONFIG.REL_GROUPS).length == 0) {
            return [];
        }

        if (!(value instanceof Array)) {
            value = [value];
        }

        value = value.filter(function(v) {
            return v.type && v.type in ALLOWED_TYPES;
        });

        // TODO: add media and rels to favicon and thumbnail plugins.
        var EXISTING_PROVIDERS = ["icon", "thumbnail"];

        if (rels.length == 1 && _.intersection(rels, EXISTING_PROVIDERS).length > 0) {
            return [];
        }

        // Apply whitelist except for thumbnails.
        if (rels.indexOf('thumbnail') === -1) {
            var tags = whitelistRecord.getQATags({}, rels);
            if (tags.indexOf('allow') === -1) {
                return [];
            }
        }

        var links = [];

        value.forEach(function(v) {

            var link = {
                href: v.href,
                title: v.title,
                type: v.type,
                rel: rels       // Validate REL?
            };

            var media = v.media;
            if (media) {
                CONFIG.MEDIA_ATTRS.forEach(function(ma) {
                    var re = "(?:^|[^-])\\b" + ma + "\\s*:\\s*([\\d./:]+)(?:px)?\\b";
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

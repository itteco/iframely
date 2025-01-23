export default {

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
                        Object.assign(link, media);
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

    parseMetaLinks: function(key, value, whitelistRecord, appname) {

        if (typeof value !== "object" || typeof value === "string") {
            return [];
        }

        var rels = key.split(/[^\w-]+/);
        // Unique values.
        rels = [...new Set(rels)];
        // Filter empty.
        rels = rels.filter(i => i);

        var isAllowed = whitelistRecord.isAllowed('html-meta.iframely') // New check.
                        || whitelistRecord.isAllowed('iframely.app');   // Old check

        // If no additional rels specified, try add 'app'.
        if (!rels.some(rel => CONFIG.REL_GROUPS && CONFIG.REL_GROUPS.includes(rel))) {
            if (isAllowed
                && /iframely/i.test(key)
                || (appname && key.indexOf(appname) === 0)) {
                // Allow <link rel="iframely" ....
                // With default rel of "app"
                rels.push(CONFIG.R.app);
            } else {
                return [];
            }
        }

        if (!/iframely/i.test(key) && appname && key.indexOf(appname) === 0) {
            // Allow url = canonical and other validations
            rels.push(CONFIG.R.iframely);
        }

        if (!(value instanceof Array)) {
            value = [value];
        }

        var ALLOWED_TYPES = Object.values(CONFIG.T);

        value = value.filter(
            // Allow empty value for `text/html`.
            v => !v.type || v.type && ALLOWED_TYPES.indexOf(v.type) > -1
        );

        // Apply whitelist except for thumbnails.
        if (rels.indexOf(CONFIG.R.thumbnail) === -1 && rels.indexOf(CONFIG.R.icon) === -1 && rels.indexOf(CONFIG.R.logo) === -1) {
            var tags = whitelistRecord.getQATags(rels);
            var isAllowedByRels = tags.indexOf('allow') > -1;

            if (!isAllowed && !isAllowedByRels) {
                return [];
            }

            // Add resizable rel.
            if (rels.indexOf(CONFIG.R.resizable) === -1 && whitelistRecord.isAllowed('html-meta.iframely', CONFIG.R.resizable)) {
                rels.push(CONFIG.R.resizable);
            }
        }

        var links = [];

        value.forEach(function(v) {

            var link = {
                href: v.href,
                title: v.title,
                type: v.type,
                rel: rels
            };

            var media = v.media;

            if (media) {
                CONFIG.MEDIA_ATTRS.forEach(function(ma) {
                    var re = "(?:^|[^-])\\b" + ma + "\\s*:\\s*([\\d./:\\s]+)(?:px)?\\b";
                    var m = media.match(re);
                    if (m) {
                        link[ma] = m[1].replace(/\s/g, '');
                    }
                });
            }

            links.push(link);
        });

        return links;
    }
};

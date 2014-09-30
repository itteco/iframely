function makeMediaResponsive(link) {
    if (!link.media) {
        link.media = {};
    }

    var m = link.media;

    if (m["aspect-ratio"]) {
        return;
    }

    if (m.width && m.height) {
        m["aspect-ratio"] = m.width / m.height;
        delete m.width;
        delete m.height;
    } else {
        m["aspect-ratio"] = 4 / 3;
    }

    if (typeof m["aspect-ratio"] === 'number') {
        m["aspect-ratio"] = Math.round(m["aspect-ratio"] * 10000) / 10000;
    }
}

function isEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

function moveMediaAttrs(link) {

    if (!link.media) {
        var m = {};
        // TODO: make for()
        CONFIG.MEDIA_ATTRS.forEach(function(attr) {
            if (attr in link) {
                var v = link[attr];

                // All values converted tu numbers.
                if (typeof v === 'string') {

                    // "4/3"
                    // "4:3"
                    var devided = v.match(/^\s*([\d.]+)(?:\/|:)([\d.]+)\s*$/);
                    if (devided) {
                        v = devided[1] / devided[2];
                    } else {
                        try {
                            v = parseFloat(v);
                        } catch (ex) {
                            v = null;
                        }
                    }
                }

                if (!v) {
                    delete link[attr];
                    return;
                }

                if (typeof v === 'number') {
                    v = Math.round(v * 10000) / 10000;
                }

                m[attr] = v;
                delete link[attr];
            }
        });

        var _imageMeta = link._imageMeta;

        if (_imageMeta && _imageMeta.width && _imageMeta.height && _imageMeta.type && !link._imageMeta.error) {
            m.width = link._imageMeta.width;
            m.height = link._imageMeta.height;
            link.type = "image/" + link._imageMeta.type.toLowerCase()
        }

        if (!isEmpty(m)) {
            link.media = m;
        }
    }
}

module.exports = {

    notPlugin: true,

    // Used from outside.

    prepareLink: function(link, options) {

        moveMediaAttrs(link);

        if (link.rel.indexOf('responsive') > -1
            && link.rel.indexOf(CONFIG.R.player) > -1) {

            makeMediaResponsive(link);
        }

        // Filter by maxwidth.
        // Needed here, because this method called after media calculated by async plugins.
        if (options.maxwidth) {

            var isImage = link.type.indexOf('image') === 0;
            // TODO: force make html5 video responsive?
            var isHTML5Video = link.type.indexOf('video/') === 0;

            if (!isImage && !isHTML5Video) {
                var m = link.media
                if (m.width && m.width > options.maxwidth) {
                    link.error = 'Too big width filtered';
                } else if (m['min-width'] && m['min-width'] > options.maxwidth) {
                    link.error = 'Too big min-width filtered';
                }
            }
        }
    }
};
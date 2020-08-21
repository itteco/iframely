function makeMediaResponsive(link) {
    if (!link.media) {
        link.media = {};
    }

    var m = link.media;

    if (!m["aspect-ratio"]) {

        if (!m.width && m.height) {
            // already responsive as fixed-height
        } else if (m.width && m.height) {
            m["aspect-ratio"] = m.width / m.height;
            delete m.width;
            delete m.height;
        } else {
            m["aspect-ratio"] = CONFIG.DEFAULT_ASPECT_RATIO || 4 / 3;

            // width and height cannot be here together, but let's clean up errors from publisher if only one of them is given.
            if (m.width) {delete m.width};
            if (m.height) {delete m.height};
        }
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

                // Do not process {scrolling: "no"}.
                if (attr === 'scrolling' && v === 'no') {
                    // NOP.
                } else
                // All values converted to numbers.
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

                if (typeof v === 'number' && attr !== 'aspect-ratio') {
                    v = Math.round(v * 10000) / 10000;
                }

                m[attr] = v;
                delete link[attr];
            }
        });

        if (!isEmpty(m)) {
            link.media = m;
        }
    }

    var _imageMeta = link._imageMeta;

    if (_imageMeta && !_imageMeta.error) {

        if (_imageMeta.width && _imageMeta.height && _imageMeta.type) {
            var m = link.media = link.media || {};
            m.width = link._imageMeta.width;
            m.height = link._imageMeta.height;
            link.type = "image/" + link._imageMeta.type.toLowerCase();
        }
    }
}

module.exports = {

    notPlugin: true,

    // Used from outside.

    prepareLink: function(link, options) {

        moveMediaAttrs(link);

        if (link.rel.indexOf(CONFIG.R.player) > -1) {

            if (link.rel.indexOf('responsive') > -1) {
                makeMediaResponsive(link);
            }
        }
    }
};

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
}

function moveMediaAttrs(link) {
    if (!link.media) {
        var m = {};
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
                    return;
                }

                if (typeof v === 'number') {
                    v = Math.round(v * 1000) / 1000;
                }

                m[attr] = v;
                delete link[attr];
            }
        });
        if (link._imageMeta && !link._imageMeta.error) {
            m.width = link._imageMeta.width;
            m.height = link._imageMeta.height;
            link.type = "image/" + link._imageMeta.type.toLowerCase()
        }

        delete link._imageMeta;
        delete link._imageStatus;
        if (!_.isEmpty(m)) {
            link.media = m;
        }
    }
}

modules.exports = {

    prepareLink: function(link) {

        moveMediaAttrs(link);

        if (link.rel.indexOf('responsive') > -1
            && link.rel.indexOf(CONFIG.R.player) > -1) {

            makeMediaResponsive(link);
        }
    }
};
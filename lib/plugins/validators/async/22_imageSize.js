var utils = require('../../../utils');
var urlLib = require('url');
var mediaPlugin = require('../media');

module.exports = {

    prepareLink: function(url, link, options, cb) {

        if (!link.href) {
            return cb();
        }

        // Check if need link processing.

        // Check if disabled by config.
        var imageOpts = CONFIG.providerOptions && CONFIG.providerOptions.images;
        if (imageOpts && imageOpts.loadSize === false) {
            return cb();
        }

        var media = link.media || {};

        var match =
            // Check link type.
            (/^image/.test(link.type))
            // Skip svg - xml not parsed here.
            && (link.type !== CONFIG.T.image_svg)
            // Check if has no media info.
            && ((!media.width || !media.height) && !media["aspect-ratio"])
            // Check if not favicon.
            && (link.rel.indexOf(CONFIG.R.icon) === -1);

        if (!match) {
            return cb();
        }

        // Start link processing.

        // Delete link.media to cover cases when only height or width is given. Otherwise, the check is useless
        delete link.media;

        // Need this for // case (no protocol).
        var href = urlLib.resolve(url, link.href);

        utils.getImageMetadata(href, options, function(error, data) {

            error = error || data.error;

            if (error) {

                if (options.debug) {
                    link._imageMeta = {
                        error: "Load image error: " + error.toString()
                    };
                }

                if (error === 404 || (error.indexOf && error.indexOf('invalid') > -1)) {
                    // Image not found. Exclude link from results.
                    link.error = error;
                }

            } else {
                link._imageMeta = {
                    type: data.format,
                    width: data.width,
                    height: data.height,
                    content_length: data.content_length
                };
            }

            // Special case: add rel image for image file with specific size.
            if (link.rel.indexOf(CONFIG.R.image) === -1 && link.rel.indexOf(CONFIG.R.file) > -1 && data.width > 200 && data.height > 150) {
                link.rel.push(CONFIG.R.image);
            }

            if (link.rel.indexOf(CONFIG.R.file) > -1 && data.width === 1 && data.height === 1) {
                link.error = "Too small image file";
            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._imageMeta = link._imageMeta || {};
                link._imageMeta.time = data && data._time;
            }

            mediaPlugin.prepareLink(link, options);

            cb();
        });
    }

};

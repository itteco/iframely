var utils = require('../../../lib/utils');
var urlLib = require('url');
var mediaPlugin = require('../media');

module.exports = {

    prepareLink: function(url, link, options, cb) {

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
            // Check if has no media info.
            && ((!media.width || !media.height) && !media["aspect-ratio"])
            // Check if not favicon.
            && (link.rel.indexOf(CONFIG.R.icon) === -1);

        if (!match) {
            return cb();
        }

        // Start link processing.

        var href = urlLib.resolve(url, link.href);

        utils.getImageMetadata(href, options, function(error, data) {

            if (error) {
                // Unknown error.
                if (options.debug) {
                    link._imageMeta = {
                        error: "Load image error: " + error.toString()
                    };
                }
            } else if (data.error) {
                if (data.error == 404) {
                    // Image not found. Exclude link from results.
                    link.error = data.error;
                } else if (options.debug) {
                    // Unknown error.
                    link._imageMeta = {
                        error: "Load image error: " + data.error
                    };
                }
            } else {
                link._imageMeta = {
                    type: data.format,
                    width: data.width,
                    height: data.height
                };
            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._imageMeta.time = data && data._time;
            }

            mediaPlugin.prepareLink(link, options);

            cb();
        });
    }

};
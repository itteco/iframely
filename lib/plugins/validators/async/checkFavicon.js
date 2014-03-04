var utils = require('../../../utils');
var urlLib = require('url');

module.exports = {

    prepareLink: function(url, link, options, cb) {

        // Check if need link processing.

        if (!link.href) {
            return cb();
        }

        var imageOpts = CONFIG.providerOptions && CONFIG.providerOptions.images;
        if (imageOpts && imageOpts.checkFavicon === false) {
            return cb();
        }

        var match =
            // Check link type.
            (/^image/.test(link.type))
            // Check if not favicon.
            && (link.rel.indexOf(CONFIG.R.icon) > -1);

        if (!match) {
            return cb();
        }

        // Start link processing.

        var uri = urlLib.resolve(url, link.href);

        utils.getUriStatus(uri, options, function(error, data) {

            error = error || data.error;

            if (error) {
                // Unknown error.
                link.error = error;
            } else {
                if (data.code != 200) {
                    // Image not found or other error. Exclude link from results.
                    link.error = data.code;
                }
            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._imageStatus = {time: data._time};
            }

            cb();
        });
    }

};
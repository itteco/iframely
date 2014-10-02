var utils = require('../../../utils');
var urlLib = require('url');

module.exports = {

    prepareLink: function(url, link, options, cb) {

        // Check if need link processing.

        if (!link.href || (link.type !== CONFIG.T.flash && link.type !== CONFIG.T.maybe_text_html)) {
            return cb();
        }

        // Need this for // case (no protocol).
        var uri = urlLib.resolve(url, link.href);

        utils.getContentType(uri, options, function(error, data) {

            if (error) {
                // Unknown error.
                link.error = error;
            } else {
                if (data.code != 200) {
                    // URI not found or other error. Exclude link from results.
                    link.error = data.code;
                }
            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._flashContentType = {time: data._time};
            }

            if (data && data.type) {
                link.type = data.type;
            }

            if (link.type === CONFIG.T.maybe_text_html) {
                // Warning: Need restore text_html type.
                link.type == CONFIG.T.text_html;
            }

            cb();
        });
    }

};
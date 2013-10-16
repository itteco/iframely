// TODO: move to plugin dir?
var readability = require('iframely-readability');
var cache = require('../../lib/cache');

module.exports = {

    getLink: function(url, readability_data, whitelistRecord, cb) {

        if (whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.photo')) {
            return cb();
        }

        cache.withCache("rdb:" + url, function(cb) {

            // TODO: handle timeout on top.

            var ignore_readability_error = false;

            if ("ignore_readability_error" in readability_data) {
                ignore_readability_error = readability_data["ignore_readability_error"];
            }

            var errorCallback = function(error) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                    if (ignore_readability_error) {
                        cb(null, readability_data.html);
                    } else {
                        cb(null, "error:" + error);
                    }
                }
            };

            var timeout = setTimeout(function() {
                errorCallback('timeout');
            }, 5000);
            // TODO: move to plugin config?

            try {
                readability.parse(readability_data.html, url, {
                    debug: false,
                    returnContentOnly: true,
                    straightifyDocument: true,
                    onParseError: errorCallback,
                    videoIframesEnabled: true
                }, function(result) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;

                        if (result.error) {
                            cb(null, 'readability error');
                        } else {
                            cb(null, result.content);
                        }
                    }
                });
            } catch (ex) {
                errorCallback(ex.message);
            }

        }, function(error, data) {
            if (error) {
                cb(error);
            } else {
                if (!data) {

                    cb('readability error');

                } else if (data.indexOf("error:") == 0) {

                    cb(data.replace("error:", ""));

                } else {

                    cb(null, {
                        html: data,
                        type: CONFIG.T.safe_html,
                        rel: [CONFIG.R.reader, CONFIG.R.inline]
                    });
                }
            }
        });
    }
};
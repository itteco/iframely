// TODO: move to plugin dir?
var readability = require('iframely-readability');

module.exports = {

    getLink: function(url, readability_data, cb) {

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
                    cb(null, {
                        html: readability_data.html,
                        type: CONFIG.T.safe_html,
                        rel: CONFIG.R.reader
                    });
                } else {
                    cb(error);
                }
            }
        };

        var timeout = setTimeout(function() {
            errorCallback('timeout');
        }, 15000); // TODO: move to plugin config?

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
                        cb('readability error');
                    } else {
                        cb(null, {
                            html: result.content,
                            type: CONFIG.T.safe_html,
                            rel: CONFIG.R.reader
                        });
                    }
                }
            });
        } catch (ex) {
            errorCallback(ex);
        }
    }
};
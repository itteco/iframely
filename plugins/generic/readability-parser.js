// TODO: move to plugin dir?
var readability = require('iframely-readability');

module.exports = {

    getLink: function(url, html_for_readability, ignore_readability_error, cb) {

        // TODO: handle timeout on top.

        var errorCallback = function(error) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
                if (ignore_readability_error) {
                    cb(null, {
                        html: html_for_readability,
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
            readability.parse(html_for_readability, url, {
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
                            rel: [CONFIG.R.reader, CONFIG.R.iframely]
                        });
                    }
                }
            });
        } catch (ex) {
            errorCallback(ex);
        }
    }
};
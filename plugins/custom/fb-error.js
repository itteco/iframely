var logging = require('../../logging');

module.exports = {

    getLink: function(oembedError, url, cb) {

        // https://developers.facebook.com/docs/graph-api/using-graph-api/error-handling/
        // Though the errors we actually need are not in the doc...
        const KNOWN_CODES = {
            2: 408,    // Downtime
            24: 404,   // Seems to be 404 for Instagrams

            100: 404,  // https://developers.facebook.com/docs/graph-api/reference/oembed-video/
            901: 417,  // ./oembed-post/, ./oembed-page/

            104: 415,            
            368: 451   // Temporary blocked
        }

        let result = {}; // When left empty - it allows a  fallback to generic parsers and get the accurate http code.
        const fbError = oembedError.body && oembedError.body.error || {};

        const error = fbError.code 
                    && KNOWN_CODES[fbError.code] /* is defined */
                    ? KNOWN_CODES[fbError.code]
                    : null;

        if (!error && 
                (!oembedError.body // Connection issue like ERR_HTTP2_STREAM_ERROR
                    || fbError.is_transient) // Unexpected transient error
                ) {            
            error = 408;
        }

        const isVideo = /(?:videos?|watch)/i.test(url);

        if (error && !isVideo) {
            result.responseError = error;
        }

        if (error === 415) {
            result.message = CONFIG.FB_ERROR_MESSAGE || 
                "HEADS UP: Facebook & Instagram now require your own access_token configured. " 
                + " See https://github.com/itteco/iframely/issues/284";
        } else if (isVideo && error === 404) {
            result.message = "This video cannot be embedded."; 
            // And fallback to generic
        } else if (fbError.message && error !== 404) {
            result.message = fbError.message;
        }

        logging.log('Facebook oembed api - error getting oembed for', url, JSON.stringify(fbError), JSON.stringify(result));

        return cb(result);
    },

    getData: function(options) {
        options.parseErrorBody = true;
    }
};
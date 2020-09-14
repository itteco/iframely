module.exports = {

    getLink: function(oembedError, cb) {

        // https://developers.facebook.com/docs/graph-api/using-graph-api/error-handling/
        // Though the errors we actually need are not in the doc...
        const KNOWN_CODES = {
            24: 404,
            100: 415
        }

        const error = oembedError.body 
                    && oembedError.body.error && oembedError.body.error.code 
                    && KNOWN_CODES[oembedError.body.error.code] /* is defined */
                    ? KNOWN_CODES[oembedError.body.error.code]
                    : oembedError;

        let result = {
            responseError: error
        };

        if (error === 415) {
            result.message = CONFIG.FB_ERROR_MESSAGE || 
                "HEADS UP: Facebook & Instagram now require your own access_token configured. " 
                + " See https://github.com/itteco/iframely/issues/284";
        }

        return cb(result);
    },

    getData: function(options) {
        options.parseErrorBody = true;
    }
};
export default {

    getLink: function(oembedError, url, log, options, cb) {

        // https://developers.facebook.com/docs/graph-api/using-graph-api/error-handling/
        // Though the errors we actually need are not in the doc...
        const KNOWN_CODES = {
            2: 408,    // Downtime
            // 24: 404,   // 404s and restricted for Instagrams, handled separately

            100: 404,  // https://developers.facebook.com/docs/graph-api/reference/oembed-video/
            901: 417,  // ./oembed-post/, ./oembed-page/

            104: 415, 
            400: 403,  // Private Media            
            368: 451   // Temporary blocked
        }

        const fbError = oembedError.body?.error || {};

        const error = fbError.code && KNOWN_CODES[fbError.code] /* is a known error code */
                    ? KNOWN_CODES[fbError.code]
                    : null;

        let result = {};        

        if (error === 415) {
            result = {
                responseError: 415,
                message: CONFIG.FB_ERROR_MESSAGE || 
                    "HEADS UP: Facebook & Instagram now require your own access_token configured. " 
                    + " See https://github.com/itteco/iframely/issues/284"
            };

        // FB video with disabled embedding
        } else if (error === 404 && /(?:videos?|watch)/i.test(url)) {            
            result = {
                fallback: "generic",
                message: "This video cannot be embedded."
            };

        // Instagram post with disabled embedding
        } else if (fbError.error_subcode == 2207046) {
            result = {
                fallback: "generic",
                message: "Owner has disabled embedding of this post"
            };

        // Instagram post either 404 or private or sensitive
        } else if (/instagram/i.test(url) && (fbError.code === 24 || fbError.code === 2 || !fbError.code)) {
            result = {
                fallback: "generic",
                message: fbError.error_user_msg || "Media can't be embedded from private, inactive, and age-restricted accounts"
            };

        // Issues with FB access token
        } else if (/endpoint must be reviewed and approved by Facebook/i.test(fbError.message)
            || /Invalid OAuth access token/i.test(fbError.message)) {

            result.message = /^(88715617|64356396)/.test(options.getProviderOptions('facebook.access_token'))
                            ? options.getProviderOptions('facebook.oembed_read_error_msg', fbError.message)
                            : fbError.message;

        //  FB downtime
        } else if (fbError.code === 2 && fbError.is_transient) {
            if (options.cache_ttl === 0) {
                result = {
                    fallback: 'generic',
                    message: "Facebook reports a downtime"
                };
            } else {
                result = {
                    responseError: 408,
                    message: "Facebook reports a downtime"
                }
            }

        // Unexpected unknown transient error.
        } else if (!error && options.cache_ttl !== 0
                && (!oembedError.body // Connection issue like ERR_HTTP2_STREAM_ERROR
                    || fbError.is_transient
                )) {
            result.responseError = 408;

        // Other known error
        } else if (error) {
            result.responseError = error;
            if (error !== 404 && (fbError.error_user_msg || fbError.message)) {
                result.message = fbError.error_user_msg || fbError.message;
            }

        // Other unknown error
        } else {
            result = {
                fallback: "generic",
                message: fbError.error_user_msg || fbError.message
            }
        }

        log('Facebook oembed api - error getting oembed for', url, JSON.stringify(fbError), JSON.stringify(result));

        return cb(result);
    },

    getData: function(options) {
        options.parseErrorBody = true;
    }
};
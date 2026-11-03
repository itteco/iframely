export default {

    getData: function(oembedError, cb) {
        return cb(oembedError < 500 
            ? {
                iframelyResponseError: {
                    status: oembedError,
                    detail: 'Publisher\'s oEmbed endpoint reported an error ' + oembedError + '.'
                }
            } : null);
    }
};
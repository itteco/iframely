module.exports = {

    getLink: function(oembedError, cb) {
        return cb ({
            responseStatusCode: oembedError.code
        });
    }
};    
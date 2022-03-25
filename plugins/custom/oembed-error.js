export default {

    getData: function(oembedError, cb) {
        return cb(oembedError < 500 ? {responseError: oembedError} : null);
    }
};
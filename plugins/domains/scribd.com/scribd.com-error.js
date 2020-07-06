module.exports = {

    re: require('./scribd.com').re,

    getData: function(oembedError, options, cb) {
        if (oembedError === 401){
            cb({
                message: "Scribd doesn't support embedding of private documents"
            }, null)
        } else {
            cb(null, null)
        }

    },

};

module.exports = {

    re: require('./scribd.com').re,

    getData: function(oembedError, options, cb) {
        if (oembedError === 401){
            cb(null, {
                message: "Scribd doesn't support embedding of private documents"
            })
        } else {
            cb(null, null)
        }

    },

};

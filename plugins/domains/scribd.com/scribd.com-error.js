module.exports = {

    re: [
        /^https?:\/\/(?:www|\w{2})\.scribd\.com\/(doc|document|embeds|presentation|fullscreen)\/(\d+)/i
    ],

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author",
        "og-image",
        "domain-icon",
        "og-description"
    ],

    getData: function(oembedError, options, cb) {
        if (oembedError === 401){
            cb({
                responseStatusCode: 401,
                message: "Scribd doesn't support embedding of private documents"
            }, null)
        } else {
            cb(null, null)
        }

    },

};

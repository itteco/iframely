var oembedUtils = require('./oembedUtils');

module.exports = {

    getData: function(oembedLinks, cb) {

        oembedUtils.getOembed(oembedLinks[0].href, function(error, oembed) {

            if (error) return cb(error);

            cb(null, {
                oembed: oembed
            });
        });
    }
};
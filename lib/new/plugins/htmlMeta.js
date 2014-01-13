var HTMLMetaHandler = require('../handlers/HTMLMetaHandler');

module.exports = {

    getData: function(uri, htmlparser, cb) {

        var metaHandler = new HTMLMetaHandler(
            uri,
            htmlparser.response.headers["content-type"],
            function(error, meta) {

                if (error) {
                    return cb(error);
                }

                cb(null, {
                    meta: meta
                });
            });

        htmlparser.addHandler(metaHandler);
    }

};
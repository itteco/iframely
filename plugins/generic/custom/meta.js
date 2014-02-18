var HTMLMetaHandler = require('../../../lib/handlers/HTMLMetaHandler');

module.exports = {

    provides: 'self',

    getData: function(uri, htmlparser, cb) {

        var metaHandler = new HTMLMetaHandler(
            uri,
            htmlparser.request.response.headers["content-type"],
            function(error, meta) {
                //console.log('meta', error, meta);
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
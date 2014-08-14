var HTMLMetaHandler = require('./HTMLMetaHandler');

module.exports = {

    provides: 'self',

    getData: function(url, htmlparser, cb) {

        var metaHandler = new HTMLMetaHandler(
            url,
            htmlparser.request.response.headers["content-type"],
            function(error, meta) {
                //console.log('meta', error, meta);
                if (error) {
                    return cb(error);
                }

                if (meta.charset.match(/^(ISO2022|X\-SJIS|MS949)/gi)) {
                    return cb({
                        responseStatusCode: 415
                    });
                }

                cb(null, {
                    meta: meta
                });
            });

        htmlparser.addHandler(metaHandler);
    }

};
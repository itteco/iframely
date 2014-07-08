var HTMLMetaHandler = require('./HTMLMetaHandler');

var pluginUtils = require('../utils');

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

                if (pluginUtils.checkRobots(meta.robots, cb)) {
                    return;
                }

                cb(null, {
                    meta: meta
                });
            });

        htmlparser.addHandler(metaHandler);
    }

};
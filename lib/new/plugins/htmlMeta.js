var HTMLMetaHandler = require('../HTMLMetaHandler');

module.exports = {

    getData: function(uri, htmlparser, cb) {

        var metaHandler = new HTMLMetaHandler(
            uri,
            htmlparser.response.headers["content-type"],
            cb);

        htmlparser.addHandler(metaHandler);
    }

};
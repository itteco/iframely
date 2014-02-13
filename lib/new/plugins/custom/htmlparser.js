var htmlparser2 = require("htmlparser2");
var Parser = htmlparser2.Parser;

var utils = require('../../utils');
var getUrl = utils.getUrl;

var CollectingHandlerForMutliTarget = require('../../handlers/CollectingHandlerForMutliTarget')


module.exports = {

    provides: 'self',

    getData: function(uri, cb) {

        // TODO: add abort in some cases.
        // TODO: return error (404, 503 etc).

        getUrl(uri).on("error", cb).on("response", function(resp) {

            if("content-type" in resp.headers && resp.headers["content-type"].substr(0, 5) !== "text/"){
                // TODO: response for other types.
                cb("document isn't text");
                return;
            }

            // Init htmlparser handler.
            var handler = new CollectingHandlerForMutliTarget();
            var parser = new Parser(handler, {
                lowerCaseTags: true
            });
            handler.response = resp;

            // Do before resume?
            cb(null, {
                htmlparser: handler
            });

            // Proxy data.
            resp.on('data', parser.write.bind(parser));
            resp.on('end', parser.end.bind(parser));

            // TODO: allow stop loading.
            // TODO: do not load other content type.
            // TODO: prevent javascript type.
        });
    }

};
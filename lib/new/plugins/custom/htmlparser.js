var _ = require('underscore');
var htmlparser2 = require("htmlparser2");
var Parser = htmlparser2.Parser;

var utils = require('../../utils');
var getUrl = utils.getUrl;

var CollectingHandlerForMutliTarget = require('../../handlers/CollectingHandlerForMutliTarget')


module.exports = {

    provides: 'self',

    getData: function(uri, options, cb) {

        var request;

        getUrl(uri, _.extend({}, options, {
            followRedirect: false
        }))
            .on("error", cb)
            .on("request", function(req) {
                request = req;
            })
            .on("response", function(resp) {

                if (resp.statusCode >= 300 && resp.statusCode < 400) {
                    cb({
                        redirect: resp.headers.location
                    });
                    return;
                }

                if (resp.statusCode !== 200) {
                    cb({
                        responseStatusCode: resp.statusCode
                    });
                    return;
                }

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
                handler.request = request;

                // Do before resume?
                cb(null, {
                    htmlparser: handler
                });

                // Proxy data.
                resp.on('data', parser.write.bind(parser));
                resp.on('end', parser.end.bind(parser));

                // TODO: do not load other content type.
                // TODO: prevent javascript type.
            });
    }

};
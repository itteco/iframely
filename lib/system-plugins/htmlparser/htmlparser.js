var _ = require('underscore');
var htmlparser2 = require('htmlparser2');
var Parser = htmlparser2.Parser;

var utils = require('../../utils');
var getUrl = utils.getUrl;

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget');


module.exports = {

    provides: [
        'self',
        'nonHtmlContentType'
    ],

    getData: function(url, options, cb) {

        var request;

        getUrl(url, _.extend({}, options, {
            followRedirect: false
        }))
            .on('error', cb)
            .on('request', function(req) {
                request = req;
            })
            .on('response', function(resp) {

                if (resp.statusCode >= 300 && resp.statusCode < 400) {
                    return cb({
                        redirect: resp.headers.location
                    });
                }

                if (resp.statusCode !== 200) {
                    return cb({
                        responseStatusCode: resp.statusCode
                    });
                }


                if('content-type' in resp.headers && !/text\/html/gi.test(resp.headers['content-type'])){
                    return cb(null, {
                        nonHtmlContentType: resp.headers['content-type']
                    });
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
            });
    },

    getLink: function(url, nonHtmlContentType) {

        // HEADS UP: do not ever remove the below check for 'javascript' in content type
        // if left allowed, it'll make apps vulnerable for XSS attacks as such files will be rendered
        if (nonHtmlContentType.indexOf('javascript') !== -1) {
            return;
        }

        return {
            href: url,
            type: nonHtmlContentType,
            rel: [(nonHtmlContentType.indexOf('image') !== -1) ? CONFIG.R.image : CONFIG.R.file]
            // client-side iframely.js will also properly render video/mp4 files this way
        };
    }

};
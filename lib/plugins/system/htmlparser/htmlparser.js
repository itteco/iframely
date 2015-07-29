var _ = require('underscore');
var htmlparser2 = require('htmlparser2');
var Parser = htmlparser2.Parser;

var utils = require('../../../utils');
var getUrl = utils.getUrl;

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget');

module.exports = {

    provides: [
        'self',
        'nonHtmlContentData'
    ],

    getData: function(url, options, cb) {

        var request;

        getUrl(url, _.extend({}, options, {
            followRedirect: false
        }))
            .on('error', function(error) {
                if (error.code === 'ENOTFOUND') {
                    error = 404;
                }
                cb({
                    responseStatusCode: error
                });
            })
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

                if('content-type' in resp.headers && !/text\/html|application\/xhtml\+xml/gi.test(resp.headers['content-type'])){
                    return cb(null, {
                        nonHtmlContentData: {
                            type: resp.headers['content-type'],
                            content_length: resp.headers['content-length']
                        }
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

    getLink: function(url, nonHtmlContentData) {
        var nonHtmlContentType = nonHtmlContentData.type;
        var nonHtmlContentLength = nonHtmlContentData.content_length;

        // HEADS UP: do not ever remove the below check for 'javascript' or 'flash' in content type
        // if left allowed, it'll make apps vulnerable for XSS attacks as such files will be rendered as regular embeds
        if (nonHtmlContentType.indexOf('javascript') !== -1 || nonHtmlContentType.indexOf('flash') !== -1) {
            return;
        }

        return {
            href: url,
            type: nonHtmlContentType,
            content_length: parseInt(nonHtmlContentLength, 10),
            rel: CONFIG.R.file
            // client-side iframely.js will also properly render video/mp4 and image files this way
        };
    }

};
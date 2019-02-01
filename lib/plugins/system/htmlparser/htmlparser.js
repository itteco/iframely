var _ = require('underscore');
var htmlparser2 = require('htmlparser2');
var Parser = htmlparser2.Parser;

var utils = require('../../../utils');
var getUrl = utils.getUrl;

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget');

module.exports = {

    provides: [
        'self',
        '__nonHtmlContentData',
        '__statusCode'
    ],

    getData: function(url, options, cb) {

        var request;

        getUrl(url, _.extend({}, options, {
            followRedirect: !!options.followHTTPRedirect
        }))
            .on('error', function(error) {
                if (error.code === 'ENOTFOUND') {
                    cb({
                        responseStatusCode: 404
                    });
                } else {
                    cb({
                        responseError: error
                    });
                }
            })
            .on('request', function(req) {
                request = req;
            })
            .on('response', function(resp) {

                if (resp.statusCode >= 300 && resp.statusCode < 400) {
                    request.abort();
                    return cb({
                        redirect: resp.headers.location
                    });
                }

                if (resp.statusCode !== 200) {
                    request.abort();
                    if (!!options.exposeStatusCode) {
                        return cb(null, {
                            __statusCode: resp.statusCode,
                            headers: resp.headers
                        });                        
                    } else {
                        return cb({
                            responseStatusCode: resp.statusCode
                        });
                    }
                }

                if('content-type' in resp.headers && !/text\/html|application\/xhtml\+xml/gi.test(resp.headers['content-type'])){
                    request.abort();
                    return cb(null, {
                        __nonHtmlContentData: {
                            type: resp.headers['content-type'],
                            content_length: resp.headers['content-length'],
                            'set-cookie': resp.headers['set-cookie']
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

    getLink: function(url, __nonHtmlContentData, options, cb) {
        var nonHtmlContentType = __nonHtmlContentData.type;
        var nonHtmlContentLength = __nonHtmlContentData.content_length;

        // HEADS UP: do not ever remove the below check for 'javascript' or 'flash' in content type
        // if left allowed, it'll make apps vulnerable for XSS attacks as such files will be rendered as regular embeds
        if (/javascript|flash|application\/json|text\/xml|application\/xml/i.test(nonHtmlContentType)) {
            return cb({
                responseStatusCode: 415
            });
        } else {
            return cb(null, {
                // link to original file URL to keep up with location changes (e.g. MP4)
                href: /video\//i.test(nonHtmlContentType) && options.redirectsHistory ? options.redirectsHistory[0] : url,
                type: nonHtmlContentType,
                content_length: parseInt(nonHtmlContentLength, 10),
                rel: CONFIG.R.file
                // client-side iframely.js will also properly render video/mp4 and image files this way
            });
        }
    }

};
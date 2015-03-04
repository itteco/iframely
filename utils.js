(function() {

    GLOBAL.CONFIG = require('./config');

    var async = require('async');
    var cache = require('./lib/cache');
    var ejs = require('ejs');
    var fs = require('fs');
    var crypto = require('crypto');
    var moment = require('moment');
    var _ = require('underscore');
    var urlLib = require('url');

    var whitelist = require('./lib/whitelist');
    var pluginLoader = require('./lib/loader/pluginLoader');

    function NotFound(message) {

        if (typeof message === 'object') {
            this.meta = message;
            message = JSON.stringify(message, null, 4);
        }

        Error.call(this); //super constructor
        Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

        this.name = this.constructor.name; //set our function’s name as error name.
        this.message = message; //set the error message

    };

    NotFound.prototype.__proto__ = Error.prototype;

    exports.NotFound = NotFound;

    var send = require('send')
        , utils = require('connect/lib/utils')
        , parse = utils.parseUrl
        , url = require('url');


    exports.static = function(root, options){
        options = options || {};

        // root required
        if (!root) throw new Error('static() root path required');

        // default redirect
        var redirect = false !== options.redirect;

        return function static(req, res, next) {
            if ('GET' != req.method && 'HEAD' != req.method) return next();
            var path = parse(options.path ? {url: options.path} : req).pathname;
            var pause = utils.pause(req);

            function resume() {
                next();
                pause.resume();
            }

            function directory() {
                if (!redirect) return resume();
                var pathname = url.parse(req.originalUrl).pathname;
                res.statusCode = 301;
                res.setHeader('Location', pathname + '/');
                res.end('Redirecting to ' + utils.escape(pathname) + '/');
            }

            function error(err) {
                if (404 == err.status) return resume();
                next(err);
            }

            send(req, path)
                .maxage(options.maxAge || 0)
                .root(root)
                .hidden(options.hidden)
                .on('error', error)
                .on('directory', directory)
                .pipe(res);
        };
    };

    var version = require('./package.json').version;

    function log() {
        var args = _.compact(Array.prototype.slice.apply(arguments));
        args.splice(0, 0, "--", moment().utc().format("\\[YY-MM-DD HH:mm:ss\\]"));
        console.log.apply(console, args);
    }

    var etag = function(value) {
        return '"' + crypto.createHash('md5').update(value).digest("hex") + '"';
    };

    function prepareUri(uri) {

        if (!uri) {
            return uri;
        }

        if (uri.match(/^\/\//i)) {
            return "http:" + uri;
        }

        if (!uri.match(/^https?:\/\//i)) {
            return "http://" + uri;
        }

        return uri;
    }

    function getKeyForUri(uri) {

        if (!uri) {
            return;
        }

        var result = 0;

        var whitelistRecord = whitelist.findRawWhitelistRecordFor(uri);
        if (whitelistRecord) {
            result += new Date(whitelistRecord.date).getTime();
        }

        var plugin = pluginLoader.findDomainPlugin(uri);
        if (plugin) {
            result += plugin.getPluginLastModifiedDate().getTime();
        }

        if (result) {
            result = Math.round(result / 1000);
        }

        return result || null;
    }

    function getUnifiedCacheUrl(req) {

        // Remove 'refresh' param and order keys.

        var urlObj = urlLib.parse(req.url, true);

        var query = urlObj.query;

        delete query.refresh;

        // Remove jsonp params.
        // TODO: remove all except possible params.
        delete query._;
        delete query[req.app.get('jsonp callback name')];
        delete query.fingerprint;
        delete query.lang;
        delete query.access_token;

        delete urlObj.search;

        var newQuery = {};

        var keys = _.keys(query);
        keys.sort();
        keys.forEach(function(key) {
            newQuery[key] = query[key];
        });

        urlObj.query = newQuery;

        return urlLib.format(urlObj);
    }

    function setResponseToCache(code, content_type, req, res, body, ttl) {

        if (!res.get('ETag')) {
            res.set('ETag', etag(body));
        }

        var url = getUnifiedCacheUrl(req);

        var head = {
            statusCode: code,
            headers: {
                'Content-Type': content_type
            },
            etag: res.get('ETag')
        };

        var data = JSON.stringify(head) + '::' + body;

        var linkValidationKey, uri = prepareUri(req.query.uri || req.query.url);
        if (uri) {
            linkValidationKey = getKeyForUri(uri);
        }

        cache.set('urlcache:' + version + (linkValidationKey || '') + ':' + url, data, {ttl: ttl});
    }

    exports.cacheMiddleware = function(req, res, next) {

        async.waterfall([

            function(cb) {
                var refresh = req.query.refresh === "true" || req.query.refresh === "1";
                if (!refresh) {

                    var url = getUnifiedCacheUrl(req);

                    var linkValidationKey, uri = prepareUri(req.query.uri || req.query.url);
                    if (uri) {
                        linkValidationKey = getKeyForUri(uri);
                    }

                    cache.get('urlcache:' + version + (linkValidationKey || '') + ':' + url, function(error, data) {
                        if (error) {
                            console.error('Error getting response from cache', url, error);
                        }
                        if (data) {
                            var index = data.indexOf("::");
                            if (index > -1) {
                                var head;
                                var headStr = data.substring(0, index);
                                try {
                                    head = JSON.parse(headStr);
                                } catch(ex) {
                                    console.error('Error parsing response status from cache', url, headStr);
                                }

                                if (head) {

                                    log("Using cache for", req.url.replace(/\?.+/, ''), req.query.uri || req.query.url);

                                    var requestedEtag = req.headers['if-none-match'];

                                    var jsonpCallback = req.query[req.app.get('jsonp callback name')];
                                    if (jsonpCallback) {

                                        // jsonp case.

                                        var body = data.substring(index + 2);

                                        body = body
                                            .replace(/\u2028/g, '\\u2028')
                                            .replace(/\u2029/g, '\\u2029');

                                        jsonpCallback = jsonpCallback.replace(/[^\[\]\w$.]/g, '');
                                        body = jsonpCallback + ' && ' + jsonpCallback + '(' + body + ');';

                                        var realEtag = etag(body);

                                        if (realEtag === requestedEtag) {
                                            res.writeHead(304);
                                            res.end();
                                        } else {
                                            this.charset = this.charset || 'utf-8';
                                            res.set('ETag', realEtag);
                                            res.set('Content-Type', 'text/javascript');
                                            res.writeHead(head.statusCode || 200, head.headers);
                                            res.end(body);
                                        }

                                    } else {

                                        // Common case.

                                        if (head.etag === requestedEtag) {
                                            res.writeHead(304);
                                            res.end();
                                        } else {
                                            this.charset = this.charset || 'utf-8';
                                            if (head.etag) {
                                                res.set('ETag', head.etag);
                                            }
                                            res.writeHead(head.statusCode || 200, head.headers);
                                            res.end(data.substring(index + 2));
                                        }
                                    }

                                } else {
                                    cb();
                                }
                            }
                        } else {
                            cb();
                        }
                    });

                } else {
                    cb();
                }
            }

        ], function() {

            // Copy from source.
            res.renderCached = function(view, context, headers) {

                if (!fs.existsSync(view)) {
                    view = __dirname + '/views/' + view;
                }

                var template = fs.readFileSync(view, 'utf8');
                var body = ejs.render(template, context);

                setResponseToCache(200, 'text/html', req, res, body);

                this.charset = this.charset || 'utf-8';
                this.writeHead(200, headers);
                this.end(body);
            };

            // Copy from source.
            res.jsonpCached = function(obj) {

                // settings
                var app = this.app;
                var replacer = app.get('json replacer');
                var spaces = app.get('json spaces');
                var body = JSON.stringify(obj, replacer, spaces);

                // content-type
                this.charset = this.charset || 'utf-8';
                this.set('Content-Type', 'application/json');

                // Cache without jsonp callback.
                setResponseToCache(200, 'application/json', req, res, body);

                // jsonp
                var callback = this.req.query[app.get('jsonp callback name')];
                if (callback) {
                    body = body
                        .replace(/\u2028/g, '\\u2028')
                        .replace(/\u2029/g, '\\u2029');

                    this.set('Content-Type', 'text/javascript');
                    var cb = callback.replace(/[^\[\]\w$.]/g, '');
                    body = cb + ' && ' + cb + '(' + body + ');';
                }

                this.send(body);
            };
            res.tryCacheError = function(error) {

                if (typeof error === "number" && Math.floor(error / 100) === 4) {

                    var value;

                    if (error === 404) {
                        value = 'Page not found';
                    } else {
                        value = 'Requested page error: ' + error;
                    }

                    setResponseToCache(error, 'text/html', req, res, value);

                } else if (typeof error === "string" && error.match(/^timeout/)) {

                    setResponseToCache(408, 'text/html', req, res, 'Requested page error: ' + error, CONFIG.CACHE_TTL_PAGE_TIMEOUT);
                }
            };

            res.sendCached = function(content_type, body) {

                setResponseToCache(200, content_type, req, res, body);

                this.charset = this.charset || 'utf-8';
                this.writeHead(200, {'Content-Type': content_type});
                this.end(body);
            };

            res.sendJsonCached = function(obj) {

                var app = this.app;
                var replacer = app.get('json replacer');
                var spaces = app.get('json spaces');

                var body = JSON.stringify(obj, replacer, spaces);

                // content-type
                this.charset = this.charset || 'utf-8';
                this.set('Content-Type', 'application/json');

                setResponseToCache(200, 'application/json', req, res, body);

                this.send(body);
            };


            next();
        });
    };

    exports.log = function() {
        var args = Array.prototype.slice.apply(arguments);
        args.splice(0, 0, "--", moment().utc().format("\\[YY-MM-DD HH:mm:ss\\]"));
        console.log.apply(console, args);
    }

})();

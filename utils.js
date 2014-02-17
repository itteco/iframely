(function() {

    GLOBAL.CONFIG = require('./config');

    var async = require('async');
    var cache = require('./lib/_old/cache');
    var ejs = require('ejs');
    var fs = require('fs');
    var crypto = require('crypto');
    var moment = require('moment');
    var _ = require('underscore');

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

    function setResponseToCache(code, content_type, req, res, body, ttl) {

        if (!res.get('ETag')) {
            res.set('ETag', etag(body));
        }

        var head = {
            statusCode: code,
            headers: {
                'Content-Type': content_type
            },
            etag: res.get('ETag')
        };

        var data = JSON.stringify(head) + '::' + body;
        cache.set('urlcache:' + version + ':' + req.url, data, {ttl: ttl});
    }

    exports.cacheMiddleware = function(req, res, next) {

        async.waterfall([

            function(cb) {
                var refresh = req.query.refresh === "true";
                if (!refresh) {

                    cache.get('urlcache:' + version + ':' + req.url, function(error, data) {
                        if (error) {
                            console.error('Error getting response from cache', req.url, error);
                        }
                        if (data) {
                            var index = data.indexOf("::");
                            if (index > -1) {
                                var head;
                                var headStr = data.substring(0, index);
                                try {
                                    head = JSON.parse(headStr);
                                } catch(ex) {
                                    console.error('Error parsing response status from cache', req.url, headStr);
                                }

                                if (head) {

                                    // TODO: use single universal log for API.
                                    log("Using cache for", req.url.replace(/\?.+/, ''), req.query.uri || req.query.url);

                                    var etag = req.headers['if-none-match'];

                                    if (head.etag === etag) {
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

                // allow status / body
                if (2 == arguments.length) {
                    // res.json(body, status) backwards compat
                    if ('number' == typeof arguments[1]) {
                        this.statusCode = arguments[1];
                    } else {
                        this.statusCode = obj;
                        obj = arguments[1];
                    }
                }

                // settings
                var app = this.app;
                var replacer = app.get('json replacer');
                var spaces = app.get('json spaces');
                var body = JSON.stringify(obj, replacer, spaces)
                    .replace(/\u2028/g, '\\u2028')
                    .replace(/\u2029/g, '\\u2029');
                var callback = this.req.query[app.get('jsonp callback name')];

                // content-type
                this.charset = this.charset || 'utf-8';
                this.set('Content-Type', 'application/json');

                // jsonp
                if (callback) {
                    this.set('Content-Type', 'text/javascript');
                    var cb = callback.replace(/[^\[\]\w$.]/g, '');
                    body = cb + ' && ' + cb + '(' + body + ');';
                }

                setResponseToCache(200, this.get('Content-Type'), req, res, body);

                this.send(body);
            };
            res.tryCacheError = function(error) {

                if (typeof error === "number" && Math.floor(error / 100) === 4) {

                    var value;
                    if (error == 404) {
                        value = 'Page not found';
                    } else {
                        value = 'Requested page error: ' + error;
                    }

                    setResponseToCache(error, 'text/html', req, res, value);

                } else if (typeof error === "string" && error.match(/^timeout/)) {

                    setResponseToCache(500, 'text/html', req, res, 'Requested page error: ' + error, CONFIG.CACHE_TTL_PAGE_TIMEOUT);
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
                setResponseToCache(200, 'application/json', req, res, JSON.stringify(obj, replacer, spaces));

                this.charset = this.charset || 'utf-8';
                this.send(obj);
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

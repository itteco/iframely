(function() {

    var async = require('async');
    var cache = require('./lib/cache');
    var ejs = require('ejs');
    var fs = require('fs');

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

    exports.cacheMiddleware = function(req, res, next) {

        var version = require('./package.json').version;

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
                                    this.charset = this.charset || 'utf-8';
                                    res.writeHead(head.statusCode || 200, head.headers);
                                    res.end(data.substring(index + 2));
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

                var head = {
                    statusCode: 200,
                    headers: headers || {
                        'Content-Type': 'text/html'
                    }
                };

                var data = JSON.stringify(head) + '::' + body;
                cache.set('urlcache:' + version + ':' + req.url, data);

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

                var head = {
                    statusCode: 200,
                    headers: {
                        'Content-Type': this.get('Content-Type')
                    }
                };

                var data = JSON.stringify(head) + '::' + body;
                cache.set('urlcache:' + version + ':' + req.url, data);

                return this.send(body);
            };
            res.tryCacheError = function(error) {
                if (typeof error === "number" && Math.floor(error / 100) === 4) {
                    var head = {
                        statusCode: error
                    };
                    var value;
                    if (error == 404) {
                        value = 'Page not found';
                    } else {
                        value = 'Requested page error: ' + error;
                    }
                    var data = JSON.stringify(head) + '::' + value;
                    cache.set('urlcache:' + version + ':' + req.url, data);
                }
            };
            res.sendCached = function(headers, value) {
                var head = {
                    statusCode: 200,
                    headers: headers
                };

                var data = JSON.stringify(head) + '::' + value;
                cache.set('urlcache:' + version + ':' + req.url, data);

                this.charset = this.charset || 'utf-8';
                this.writeHead(200, headers);
                this.end(value);
            };
            res.sendJsonCached = function(obj) {
                var head = {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                var data = JSON.stringify(head) + '::' + JSON.stringify(obj, null, 4);
                cache.set('urlcache:' + version + ':' + req.url, data);

                this.charset = this.charset || 'utf-8';
                this.send(obj);
            };
            next();
        });
    };

})();

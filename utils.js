    import * as async from 'async';
    import { cache } from './lib/cache.js';
    import * as ejs from 'ejs';
    import * as fs from 'fs';
    import * as crypto from 'crypto';
    import * as _ from 'underscore';
    import * as urlLib from 'url';

    import log from './logging.js';
    export { log };
    import * as whitelist from './lib/whitelist.js';
    import * as pluginLoader from './lib/loader/pluginLoader.js';

    import { fileURLToPath } from 'url';
    import { dirname } from 'path';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    export function NotFound(message, messages) {

        if (typeof message === 'object') {
            this.meta = message;
            message = JSON.stringify(message, null, 4);
        }

        Error.call(this); //super constructor
        Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

        this.name = this.constructor.name; //set our function’s name as error name.
        this.message = message; //set the error message
        this.messages = messages; //additional messages

    }

    NotFound.prototype.__proto__ = Error.prototype;

    export function HttpError(code, message, messages) {

        Error.call(this); //super constructor
        Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

        this.name = this.constructor.name; //set our function’s name as error name.
        this.message = message; //set the error message
        this.messages = messages; //additional messages
        this.code = code; //set the error code

    }

    HttpError.prototype.__proto__ = Error.prototype;

    import { readFile } from 'fs/promises';
    const json = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
    var version = json.version;

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

    function setResponseToCache(code, req, res, body, ttl) {

        if (!res.get('ETag')) {
            res.set('ETag', etag(body));
        }

        var url = getUnifiedCacheUrl(req);

        var head = {
            statusCode: code,
            headers: {
                'Content-Type': res.get('Content-Type'),
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

    export function cacheMiddleware(req, res, next) {

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

                                    log(req, "Using cache for", req.url.replace(/\?.+/, ''), req.query.uri || req.query.url);

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
                                            res.set(head.headers);
                                            res.set('ETag', realEtag);
                                            res.set('Content-Type', 'text/javascript');
                                            res
                                                .status(head.statusCode || 200)
                                                .send(body);
                                        }

                                    } else {

                                        // Common case.

                                        if (head.etag === requestedEtag) {
                                            res.writeHead(304);
                                            res.end();
                                        } else {
                                            res.set(head.headers);
                                            if (head.etag) {
                                                res.set('ETag', head.etag);
                                            }
                                            res
                                                .status(head.statusCode || 200)
                                                .send(data.substring(index + 2));
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

                this.set(headers);

                setResponseToCache(200, req, res, body);

                this.send(body);
            };

            // Copy from source.
            res.jsonpCached = function(obj) {

                // settings
                var app = this.app;
                var replacer = app.get('json replacer');
                var spaces = app.get('json spaces');
                var body = JSON.stringify(obj, replacer, spaces);

                // content-type
                this.set('Content-Type', 'application/json');

                // Cache without jsonp callback.
                setResponseToCache(200, req, res, body);

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

            res.sendCached = function(content_type, body, options) {

                var status = options && options.code || 200;

                this.set('Content-Type', content_type);

                setResponseToCache(status, req, res, body, options && options.ttl);

                this.status(status).send(body);
            };

            res.sendJsonCached = function(obj, options) {

                var app = this.app;
                var replacer = app.get('json replacer');
                var spaces = app.get('json spaces');

                var body = JSON.stringify(obj, replacer, spaces);

                this.set('Content-Type', 'application/json');

                var status = options && options.code || 200;

                setResponseToCache(status, req, res, body, options && options.ttl);

                this.status(status).send(body);
            };

            next();
        });
    };

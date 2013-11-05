(function(iframely) {

    var async = require('async');
    var request = require('request');
    var zlib = require('zlib');
    var imagesize = require('imagesize');
    var _ = require('underscore');
    var events = require('events');
    var iconv = require('iconv-lite');
    var sax = require('sax');
    var htmlparser2 = require('htmlparser2');
    var decodeHTML5 = require('entities').decodeHTML5;
    var url = require('url');
    var mimelib = require('mimelib');

    var utils = require('./utils.js');
    var cache = require('./cache.js');

   /*
    * 1. Get all page meta:
    *   - og
    *   - twitter
    *   - meta links
    *       - image_src
    *       - oembed discovery
    *           - generate by static providers list if not exists
    *       - shorturl
    *       - ...
    *   - html tags
    *       - title
    *       -description
    *       - ...
    *
    * 2. Get oembed by discovery url:
    *   - parse XML to JSON
    *
    * 4. getImageMetadata.
    *   - mime type
    *   - width
    *   - height
    *
    * 5. Configurable caching for loaded data.
    *
    * */

   /**
    * @public
    * Fetches page data by uri.
    * @param {String} uri The page uri.
    * @param {Object} [options] Options.
    * @param {Boolean} [options.meta] True if need load page meta. Default: true.
    * @param {Boolean} [options.oembed] True if need load page oEmbed. Default: true.
    * @param {Boolean} [options.fullResponse] True if need load full page response. Default: true.
    * @param {Boolean} [options.disableCache] True to disable cache. Default: false.
    * @param {Function} callback Completion callback function. Runs when all required data fetched. The callback gets two arguments (error, data) where data is:
    *  - data.meta - page meta and oembed merged (if oembed was requested)
    *  - data.fullResponse - string with page content
    * */
    iframely.getPageData = function(uri, options, callback) {

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        options = options || {};

        options.timeout = options.timeout || CONFIG.metaLoadingTimeout;

        var oembedTime, totalTime = utils.createTimer();

        var redirectedUri;

        var needFullResponse = options.fullResponse !== false;
        var needOembed = options.oembed !== false;
        var needMeta = options.meta !== false;

        var metaGotFromCache = false;
        var oembedGotFromCache = false;
        var fullResponseGotFromCache = false;

        var oembedLoadingStarted = false;

        var requestInstance = null;

        var data = {
            time: {}
        };
        var finished = false;

        var timeout;
        function clearTimeout2() {
            if (!options.timeout) {
                return true;
            }
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
                return true;
            } else {
                return false;
            }
        }

        function finish(error) {

            if (finished) {
                return;
            }

            if (error) {

                finished = true;

                if (error === "timeout" || error.code === "ETIMEDOUT") {
                    error = "timeout " + options.timeout/1000 + ' sec.';
                }

                if (clearTimeout2()) {
                    requestInstance && requestInstance.abort();
                    callback(error);
                }

            } else {

                if ((!needMeta || data.meta) && (!needFullResponse || data.fullResponse) && (!needOembed || data.oembed)) {

                    finished = true;

                    if (!fullResponseGotFromCache && data.meta && data.meta.charset && data.fullResponse) {
                        var charset = getCharset(data.meta.charset, true);
                        data.fullResponse = encodeText(charset, data.fullResponse);
                    }

                    if (!metaGotFromCache && data.meta)
                        cache.set("meta:" + uri, data.meta);
                    if (!oembedGotFromCache && data.oembed)
                        cache.set("oembed:" + uri, data.oembed);
                    if (!fullResponseGotFromCache && data.fullResponse)
                        cache.set("fullResponse:" + uri, data.fullResponse);

                    if (redirectedUri)
                        cache.set("redirect:" + uri, redirectedUri);

                    if (options._debugCache) {
                        data._debugCache = {
                            metaGotFromCache: metaGotFromCache,
                            oembedGotFromCache: oembedGotFromCache,
                            fullResponseGotFromCache: fullResponseGotFromCache
                        }
                    }

                    if (_.isEmpty(data.oembed)) {
                        delete data.oembed;
                    }


                    if (clearTimeout2()) {
                        requestInstance && requestInstance.abort();
                        callback(error, data);
                    }
                }
            }
        }


        if (options.timeout) {
            timeout = setTimeout(function() {
                finish("timeout")
            }, options.timeout);
        }

        async.waterfall([

            function(cb) {

                if (options.disableCache) {
                    cb(null, {
                        meta: null,
                        oembed: null,
                        fullResponse: null
                    });
                } else {
                    async.parallel({
                        meta: function(cb) {
                            cache.get("meta:" + uri, cb);
                        },
                        oembed: function(cb) {
                            if (needOembed) {
                                cache.get("oembed:" + uri, cb)
                            } else {
                                cb();
                            }
                        },
                        fullResponse: function(cb) {
                            if (needFullResponse) {
                                cache.get("fullResponse:" + uri, cb)
                            } else {
                                cb();
                            }
                        },
                        redirectUri: function(cb) {
                            cache.get("redirect:" + uri, cb)
                        }
                    }, cb);
                }
            },

            function(cachedData, cb) {

                if (cachedData.meta) {
                    metaGotFromCache = true;
                    data.meta = cachedData.meta;
                }

                if (cachedData.oembed) {
                    oembedGotFromCache = true;
                    data.oembed = cachedData.oembed;
                }

                if (cachedData.fullResponse) {
                    fullResponseGotFromCache = true;
                    data.fullResponse = cachedData.fullResponse;
                }

                if (cachedData.redirectUri) {
                    redirectedUri = cachedData.redirectUri;
                    data.href = cachedData.redirectUri;
                }

                // Try finish if all data present.
                finish();

                if (finished) {
                    return;
                }

                async.waterfall([

                    function tryLoadOembed(oembedCallback) {

                        if (!data.oembed && needOembed) {

                            // Filter oembed from meta.
                            var oembedLinks = findOembedLinks(uri, data.meta);

                            // Optional load oembed if cache present.
                            if (oembedLinks) {

                                oembedLoadingStarted = true;

                                oembedTime = utils.createTimer();

                                getOembed(oembedLinks[0].href, function(error, oembed) {

                                    data.time.oembedWithoutMeta = oembedTime();

                                    if (error) {
                                        // TODO: Store broken oembed endpoint.
                                        console.error("Error on oembed", error, oembedLinks[0].href);
                                        data.errors = data.errors || [];
                                        data.errors.push("Error on oembed " + error + ' ' + oembedLinks[0].href);
                                    }

                                    data.oembed = oembed || {};

                                    finish();
                                });
                            }
                        }

                        oembedCallback();
                    },

                    function loadAll() {

                        // Do not load page if need only oembed and it started loading.
                        if (oembedLoadingStarted) {
                            if ((data.meta || !needMeta) && (data.fullResponse || !needFullResponse)) {
                                return;
                            }
                        }

                        log("   - Start get page", uri);
                        getUrl(uri, {
                            jar: options.jar,
                            maxRedirects: 3,
                            timeout: options.timeout,
                            fullResponse: needFullResponse && !data.fullResponse // Optional load fullResponse if cache present.
                        })
                            .on('request', function(req) {
                                requestInstance = req;
                            })
                            .on('response', function(res) {

                                res.pause();

                                log("       - got response", res.statusCode, uri);

                                res.on('error', function(error) {
                                    log("       - error", uri, error);
                                    finish(error);
                                });

                                if (res.request.href != uri) {
                                    console.log('  -- redirect to', res.request.href);
                                    redirectedUri = res.request.href;
                                    data.href = res.request.href;
                                }

                                data.time.metaResponseStarted = totalTime();

                                if (res.statusCode == 200) {

                                    if (res.headers && /text\/html/gi.test(res.headers['content-type'])) {

                                        async.waterfall([

                                            function(cb) {

                                                // Optional load meta if cache present.
                                                if (data.meta) {
                                                    cb(null, data.meta);
                                                } else {
                                                    var parser = parseMetaData(uri, res.headers['content-type'], cb);
                                                    res.on('data', parser.write.bind(parser));
                                                    res.on('end', parser.end.bind(parser));
                                                }

                                                res.resume();
                                            },

                                            function(meta, cb) {

                                                data.time.metaLoadedAndParsed = totalTime();

                                                data.meta = meta;

                                                // Filter oembed from meta.
                                                var oembedLinks = needOembed && findOembedLinks(uri, data.meta);

                                                // Optional load oembed if cache present.
                                                if (oembedLinks && !data.oembed && !oembedLoadingStarted) {

                                                    oembedTime = utils.createTimer();

                                                    getOembed(oembedLinks[0].href, function(error, oembed) {

                                                        data.time.oembedAfterMeta = oembedTime();

                                                        if (error) {
                                                            // TODO: Store broken oembed endpoint.
                                                            console.error("Error on oembed", error, oembedLinks[0].href);
                                                            data.errors = data.errors || [];
                                                            data.errors.push("Error on oembed " + error + ' ' + oembedLinks[0].href);
                                                        }

                                                        cb(null, oembed);
                                                    });
                                                } else {
                                                    cb(null, null);
                                                }
                                            },

                                            function(oEmbed, cb) {
                                                if (needOembed && !oembedLoadingStarted && !data.oembed) {
                                                    data.oembed = oEmbed || {};
                                                }

                                                cb();
                                            }

                                        ], function(error) {
                                            finish(error);
                                        });

                                    } else {

                                        finished = true;

                                        requestInstance && requestInstance.abort();

                                        processNonHtmlResponse(uri, res, callback);
                                    }
                                } else {

                                    requestInstance && requestInstance.abort();

                                    callback(res.statusCode || 'no response statusCode');
                                }
                            })
                            .on('complete', function(body) {
                                log("       - full response", uri);
                                // TODO: always store in cache. If another request in time of loading this - wait first to finish and load from cache.
                                data.time.fullResponse = totalTime();
                                data.fullResponse = body;
                                // Debug page.
                                //var fs = require('fs');
                                //fs.writeFileSync(new Date().getTime() +'_' + uri.replace(/\//g,'_') + '.html', body);
                                finish();
                            })
                            .on('error', function(error) {
                                log("       - error", uri, error);
                                finish(error);
                            });
                    }

                ], cb);
            }
        ], function(error) {
            if (error) {
                callback(error)
            };
        });
    };

   /**
    * @public
    * Get image size and type.
    * @param {String} uri Image uri.
    * @param {Object} [options] Options.
    * @param {Boolean} [options.cache] False to disable cache. Default: true.
    * @param {Function} callback Completion callback function. The callback gets two arguments (error, result) where result has:
    *  - result.format
    *  - result.width
    *  - result.height
    *
    *  error == 404 if not found.
    * */
    iframely.getImageMetadata = function(uri, options, callback){

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        options = options || {};

        cache.withCache("image:" + uri, function(cb) {

            var loadImageHead, imageResponseStarted, totalTime, timeout;
            var requestInstance = null;

            function finish(error, data) {

                // We don't need more data.
                requestInstance && requestInstance.abort();

                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                } else {
                    return;
                }

                if (!error && !data) {
                    error = 404;
                }

                data = data || {};

                data._time = {
                    imageResponseStarted: imageResponseStarted || totalTime(),
                    loadImageHead: loadImageHead && loadImageHead() || 0,
                    total: totalTime()
                };

                if (error) {

                    if (error == "timeout") {
                        data.error = error;
                        return cb(null, data);
                    }

                    if (error.code == "ENOTFOUND"
                        || error == 500
                        || error == 404) {
                        data.error = 404;
                        return cb(null, data);
                    }

                    if (error.code == 1) {
                        data.error = error.message;
                        return cb(null, data);
                    }
                }

                cb(error, data);
            }

            timeout = setTimeout(function() {
                finish("timeout");
            }, options.timeout || 2000);


            totalTime = utils.createTimer();

            async.waterfall([
                function(cb){

                    getUrl(uri, {
                        timeout: options.timeout || 2000,
                        maxRedirects: 5,
                        asBuffer: true
                    })
                        .on('request', function(req) {
                            requestInstance = req;
                        })
                        .on('response', function(res) {
                            if (res.statusCode == 200) {
                                imageResponseStarted = totalTime();
                                imagesize(res, cb);
                            } else {
                                cb(res.statusCode);
                            }
                        })
                        .on('error', function(error) {
                            cb(error);
                        });
                },
                function(data, cb){

                    loadImageHead = utils.createTimer();

                    cb(null, data);
                }
            ], finish);

        }, callback, options.disableCache);
    };

    iframely.getUriStatus = function(uri, options, callback) {

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        options = options || {};

        cache.withCache("status:" + uri, function(cb) {

            var time, timeout;

            function finish(error, data) {

                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                } else {
                    return;
                }

                data = data || {};

                data._time = time();

                if (error) {
                    data.error = error;
                    return cb(null, data);
                }

                cb(null, data);
            }

            timeout = setTimeout(function() {
                finish("timeout");
            }, options.timeout || 2000);

            time = utils.createTimer();

            getUriStatus(uri, 5, finish);

        }, callback, options.disableCache);
    };

    //====================================================================================
    // Private
    //====================================================================================

    function getUriStatus(uri, maxRedirects, cb) {

        var r = request({
            uri: uri,
            method: 'GET',
            headers: {
                'User-Agent': CONFIG.USER_AGENT
            },
            maxRedirects: maxRedirects,
            jar: request.jar()   //Enable cookies, uses new jar
        })
            .on('error', function(error) {
                cb(null, {
                    error: error
                });
            })
            .on('response', function(res) {
                r.abort();
                cb(null, {
                    code: res.statusCode
                });
            });
    }

    /**
     * @private
     * Convert XML or JSON stream to an oEmbed object.
     */
    function stream2oembed(stream, callback) {
        stream.headers['content-type'].match('xml') ?
            xmlStream2oembed(stream, callback) :
            jsonStream2oembed(stream, callback);
    }

    /**
     * @private
     * Do HTTP GET request and handle redirects
     * @param url Request uri (parsed object or string)
     * @param {Object} options
     * @param {Number} [options.maxRedirects]
     * @param {Boolean} [options.fullResponse] True if need load full page response. Default: false.
     * @param {Function} [callback] The completion callback function or events.EventEmitter object
     * @returns {events.EventEmitter} The emitter object which emit error or response event
     */
    function getUrl(url, options) {

        var req = new events.EventEmitter();

        var jar = options.jar;

        if (!jar) {
            jar = request.jar();
        }

        var buffer = [];
        function bindBodyGetter(stream) {
            stream.on('data', function(chunk) {
                buffer.push(chunk);
            });
            stream.on('end', function() {
                body = buffer.join('');
                req.emit('complete', body);
            });
        }

        process.nextTick(function() {
            try {

                var supportGzip = !process.version.match(/^v0\.8/);

                var r = request({
                    uri: url,
                    method: 'GET',
                    headers: {
                        'User-Agent': CONFIG.USER_AGENT,
                        'Accept-Encoding': supportGzip ? 'gzip,deflate' : ''
                    },
                    maxRedirects: options.maxRedirects,
                    timeout: options.timeout,
                    jar: jar
                })
                    .on('error', function(error) {
                        req.emit('error', error);
                    })
                    .on('response', function(res) {

                        if (['gzip', 'deflate'].indexOf(res.headers['content-encoding']) > -1) {

                            var gunzip = zlib.createUnzip();
                            gunzip.request = res.request;
                            gunzip.statusCode = res.statusCode;
                            gunzip.headers = res.headers;

                            if (!options.asBuffer) {
                                gunzip.setEncoding("binary");
                            }

                            if (options.fullResponse) {
                                bindBodyGetter(gunzip);
                            }

                            req.emit('response', gunzip);

                            res.pipe(gunzip);


                        } else {

                            if (!options.asBuffer) {
                                res.setEncoding("binary");
                            }

                            if (options.fullResponse) {
                                bindBodyGetter(res);
                            }

                            req.emit('response', res);
                        }
                    });

                req.emit('request', r);

            } catch (ex) {
                console.error('Error on getUrl for', url, '.\n Error:' + ex);
                req.emit('error', ex);
            }
        });
        return req;
    }

    /**
     * @private
     */
    function encodeText(charset, text) {
        try {
            var b = iconv.encode(text, "ISO8859-1");
            return iconv.decode(b, charset || "UTF-8");
        } catch(e) {
            return text;
        }
    }

    /**
     * @private
     */
    function getCharset(string, doNotParse) {
        var charset;

        if (doNotParse) {
            charset = string.toUpperCase();
        } else if (string) {
            var m = string && string.match(/charset\s*=\s*([\w_-]+)/i);
            charset = m && m[1].toUpperCase();
        }

        if (charset && charset === 'UTF-8')
            charset = null;

        return charset;
    }

    /**
     * @private
     * Convert XML stream to an oembed object
     */
    function xmlStream2oembed(stream, callback) {
        var oembed;
        var prop;
        var value;
        var firstTag;

        var charset = getCharset(stream.headers && stream.headers['content-type']);

        var saxStream = sax.createStream();
        saxStream.on('error', function(err) {
            callback(err);
        });
        saxStream.on('opentag', function(tag) {
            if (!firstTag) {
                // Should be HEAD but HASH tag found on qik.
                firstTag = tag.name;
                oembed = {};
            } else if (oembed) {
                prop = tag.name.toLowerCase();
                value = "";
            }
        });
        saxStream.on('text', function(text) {
            if (prop) value += text;
        });
        saxStream.on('cdata', function(text) {
            if (prop) value += text;
        });
        saxStream.on('closetag', function(name) {
            if (name === firstTag) {
                callback(null, oembed);

            } else {
                if (prop) {
                    value = encodeText(charset, value);

                    if (prop.match(/(width|height)$/)) {

                        if (value.match(/^\d+(px)?$/)) {
                            value = parseInt(value, 10);
                        } else {
                            // For case like 100%.
                            value = undefined;
                        }
                    }

                    oembed[prop] = value;
                }
                prop = null;
            }
        });

        stream.pipe(saxStream);
    }

    /**
     * @private
     * Convert JSON stream to an oembed object
     */
    function jsonStream2oembed(stream, callback) {

        var charset = getCharset(stream.headers && stream.headers['content-type']);

        var data = "";
        stream.on('data', function(chunk) {
            data += chunk;

        }).on('end', function() {
                try {
                    data = JSON.parse(encodeText(charset, data));
                } catch (e) {
                    callback(e);
                    return;
                }

                for(var prop in data) {

                    var value = data[prop];

                    if (prop.match(/(width|height)$/) && (typeof value === "string")) {

                        if (value.match(/^\d+(px)?$/)) {
                            value = parseInt(value, 10);
                            data[prop] = value;
                        } else {
                            // For case like 100%.
                            data[prop] = undefined;
                        }
                    }
                }

                lowerCaseKeys(data);

                callback(null, data);
            });
    }

    var LINK_REL_SKIP_VALUES = [
        'help',
        'license',
        'next',
        'prefetch',
        'prev',
        'search',
        'stylesheet'
    ];

    var LINK_REL_ARRAY_VALUES = [
        'alternate'
    ];

    function lowerCaseKeys(obj) {
        for (var k in obj) {
            var lowerCaseKey = k.toLowerCase();
            if (lowerCaseKey != k) {
                obj[lowerCaseKey] = obj[k];
                delete obj[k];
                k = lowerCaseKey;
            }
            if (typeof obj[k] == "object") {
                lowerCaseKeys(obj[k]);
            }
        }
    }

    /**
     * @private
     * Parse Open Graph meta on page
     */
    function parseMetaData(uri, contentType, callback) {

        var charset = getCharset(contentType);

        var result = {};

        var currentCustomTag;
        var customProperties = {};

        function _merge(parentObj, props, value) {
            function _buildChildren(children, obj) {
                var current = obj;
                children.forEach(function(child){
                    if (typeof(current[child]) != 'object') {
                        if(typeof(current[child]) == 'undefined') {
                            current[child] = {};
                        } else {
                            if (child == 'audio' || child == 'image' || child == 'video') {
                                current[child] = {
                                    url: current[child]
                                }
                            } else {
                                current[child] = {
                                    value: current[child]
                                }
                            }
                        }
                    }
                    current = current[child];
                });
                return current;
            }

            var currentNode = props.slice(-1)[0];

            if (typeof(currentNode) == 'undefined'){
                return;
            }

            var parentNode = _buildChildren(props.slice(0,-1),parentObj);

            if (!(currentNode in parentNode)) {
                parentNode[currentNode] = value;

            } else if (_.isArray(parentNode[currentNode])) {
                parentNode[currentNode].push(value);

            } else {
                if (parentNode[currentNode] != value){
                    parentNode[currentNode] = [parentNode[currentNode], value];
                }
            }
        }

        function _finalMerge() {
            for(var name in customProperties) {
                if (!(name in result)) {
                    result[name] = customProperties[name];
                }
            }

            function encodeAllStrings(obj) {
                for (var k in obj) {
                    if (typeof obj[k] == "object") {
                        encodeAllStrings(obj[k]);
                    } else {
                        if (!obj.hasOwnProperty(k)) {
                            continue;       // skip this property
                        }
                        if (typeof(obj[k]) == 'string'){
                            // decode HTML entities after decoding the charset
                            // otherwise we would end up with a string with mixed encoding
                            obj[k] = decodeHTML5(encodeText(charset, obj[k]));
                        }
                    }
                }
            }

            //This is the "to-the-forehead" solution for those glitchy situations.
            function processArrays(obj){
                for (var k in obj) {
                    if (!obj.hasOwnProperty(k)) {
                        continue;
                    } else if (obj[k] instanceof Array){
                        if ((obj[k].length == 2) && (typeof(obj[k][0]) == 'object') && ((typeof(obj[k][1])!='undefined') && (typeof(obj[k][1])!='object'))){
                            obj[k][0][(k == 'audio' || k == 'image' || k == 'video') ? 'url' : 'value'] = obj[k][1];
                            obj[k] = obj[k][0];
                        }
                    } else if (typeof obj[k] == "object"){
                        processArrays(obj[k]);
                    }
                }
            }

            encodeAllStrings(result);
            processArrays(result);
            lowerCaseKeys(result);

            result['charset'] = charset || 'UTF-8';
        }

        var end = false;
        return new htmlparser2.Parser({
            onerror: function (err) {
                if (end) return;

                console.error('htmlparser2 error', err);
                callback(err);
                end = true;
            },
            onopentag: function(name, attributes) {
                if (end) return;

                name = name.toUpperCase();
                if (name === 'META') {
                    var metaTag = attributes;

                    if (('property' in metaTag) || ('name' in metaTag)) {

                        var propertyParts = ('property' in metaTag) ? metaTag.property.split(':') : metaTag.name.split(':');

                        var value = metaTag.content || metaTag.value;

                        if (typeof(value) == 'string') {
                            value = value.replace(/(\r\n|\n|\r)/gm,"");
                        }

                        if (/^\d+$/.test(value)) { // convert to integer
                            value = parseInt(value,10);
                        }

                        if (typeof value !== 'undefined') {
                            _merge(result, propertyParts, value);
                        }

                    } else if (metaTag['http-equiv'] && metaTag['http-equiv'].toLowerCase() == 'content-type') {
                        // Override encoding with <meta content='text/html; charset=UTF-8' http-equiv='Content-Type'/>
                        charset = getCharset(metaTag.content);
                    } else if (metaTag['charset']) {
                        // Override encoding with <meta charset="UTF-8" />.
                        charset = getCharset(metaTag.charset, true);
                    } else if (metaTag['http-equiv'] && metaTag['http-equiv'].toLowerCase() == 'x-frame-options') {
                        customProperties["x-frame-options"] = metaTag.content;
                    } else if (metaTag.name == "description") {
                        customProperties["html-description"] = metaTag.content;
                    }

                } else if (name == 'TITLE') {
                    currentCustomTag = {
                        name: "html-title",
                        value: ""
                    };
                } else if (name == 'LINK') {
                    var metaTag = attributes;
                    var name = metaTag.name;
                    var rel = metaTag.rel || name;
                    var title = metaTag.title;
                    var sizes = metaTag.sizes;
                    var type = metaTag.type;
                    var media = metaTag.media;
                    var href;
                    if (typeof(metaTag.href) == 'string') {
                        href = metaTag.href.replace(/(\r\n|\n|\r)/gm,"");
                        href = url.resolve(uri, href);
                    }

                    if (LINK_REL_SKIP_VALUES.indexOf(rel) == -1) {
                        var existingProperty = customProperties[rel];

                        if (existingProperty && !(existingProperty instanceof Array)) {
                            existingProperty = customProperties[rel] = [existingProperty];
                        }

                        if (!existingProperty && LINK_REL_ARRAY_VALUES.indexOf(rel) > -1) {
                            existingProperty = customProperties[rel] = [];
                        }

                        var property;
                        if (type || sizes || media || title) {
                            property = {
                                href: href
                            };
                            if (type) {
                                property.type = type;
                            }
                            if (sizes) {
                                property.sizes = sizes;
                            }
                            if (media) {
                                property.media = media;
                            }
                            if (title) {
                                property.title = title;
                            }
                        } else {
                            property = href;
                        }

                        if (existingProperty) {
                            existingProperty.push(property);
                        } else {
                            customProperties[rel] = property;
                        }
                    }
                }
            },
            ontext: function(text) {
                if (currentCustomTag) {
                    currentCustomTag.value += text;
                }
            },
            onclosetag: function(name) {
                if (end) return;

                if (currentCustomTag) {
                    customProperties[currentCustomTag.name] = currentCustomTag.value;
                    currentCustomTag = null;
                }

                if (name.toUpperCase() === 'HEAD') {
                    _finalMerge();
                    callback(null, result);
                    end = true;
                }
            },
            onend: function() {
                if (end) return;

                _finalMerge();
                callback(null, result);
                end = true;
            }
        });
    }

    function processNonHtmlResponse(uri, res, callback){
        var headers = _.pick(res.headers || {}, 'last-modified','content-type', 'content-length', 'content-disposition', 'expires', 'cache-control');
        var filename;

        if (headers['content-disposition']){
            //RFC2231 parsing
            var cdheader = mimelib.parseHeaderLine(mimelib.parseMimeWords(headers['content-disposition']));

            if (cdheader['filename*']){
                //TODO: test this! I cannot find a public URL that uses filename*
                var nameparts = cdheader['filename*'].replace( /^"+|"+$/g, '').split('\'');
                var encoding, encodedname;
                if (nameparts.length == 1){
                    encodedname = nameparts[0];
                } else if (nameparts.length == 3) {
                    encoding = nameparts[0].replace(/^\s+|\s+$/g, '');
                    encodedname = nameparts[2];
                }

                if (encodedname){
                    filename = iconv.decode(decodeURIComponent(encodedname), encoding || 'utf8');
                }
            }

            if (!filename && cdheader['filename']){
                //Already processed by mimelib, needs only to remove optional quotes
                filename = cdheader['filename'].replace( /^"+|"+$/g, '');
            }

        }

        if (!filename){
            var m = uri.match(/\/([^\/\?&#]+\.[%\w\-]+)$/);
            if (m){
                filename = m[1];
            }
        }

        callback({error: 'invalid-content-type', url:uri, headers: headers, filename:filename});
    }

    /**
     * @private
     * Get the oembed uri via known providers
     * @param {String} uri The page uri
     * @return {String} The oembed uri
     */
    function lookupStaticProviders(uri) {
        var providers = require('../providers.json');

        var protocolMatch = uri.match(/^(https?:\/\/)/);
        if (!protocolMatch) {
            return null;
        }
        var uri2 = uri.substr(protocolMatch[1].length);

        var links;

        for (var j = 0; j < providers.length; j++) {
            var p = providers[j];
            var match;
            for (var i = 0; i < p.templates.length; i++) {
                match = uri2.match(p.templates[i]);
                if (match) break;
            }

            if (match) {

                uri = uri.replace(/#.+$/, "");

                var endpoint = p.endpoint;

                var groups = endpoint.match(/\{\d+\}/g);
                if (groups) {
                    groups.forEach(function(g) {
                        var n = parseInt(g.match(/\{(\d+)\}/)[1]);
                        endpoint = endpoint.replace("{" + n + "}", match[n]);
                    });

                } else if (endpoint.match(/\{url\}/)) {
                    endpoint = endpoint.replace(/\{url\}/, encodeURIComponent(uri));

                } else {
                    endpoint = endpoint + '?url=' + encodeURIComponent(uri);
                }

                links = ['json', 'xml'].map(function(format) {
                    return {
                        href: endpoint.match(/\{format\}/)? endpoint.replace(/\{format\}/, format): endpoint + '&format=' + format,
                        rel: 'alternate',
                        type: 'application/' + format + '+oembed'
                    };
                });
                break;
            }
        }

        return links;
    }

    function findOembedLinks(uri, meta) {
        // Filter oembed from meta.
        var alternate = meta && meta.alternate;
        if (alternate && !(alternate instanceof Array)) {
            alternate = [alternate];
            meta.alternate = alternate;
        }
        var oembedLinks = meta && meta.alternate && meta.alternate.filter(function(link) {
            return /^(application|text)\/(xml|json)\+oembed$/i.test(link.type);
        });

        if (!oembedLinks || !oembedLinks.length) {
            // Find oembed in static providers list.
            oembedLinks = lookupStaticProviders(uri);

            if (meta && oembedLinks) {
                // Merge found links to meta.
                meta.alternate = (meta.alternate || []).concat(oembedLinks);
            }
        }

        return oembedLinks;
    }

    /**
     * @private
     * Fetches and parses oEmbed by oEmbed URL got from discovery.
     * @param {String} uri Full oEmbed endpoint plus URL and any needed format parameter.
     * @param {Function} callback Completion callback function. The callback gets two arguments (error, oembed) where oembed is json parsed oEmbed object.
     * */
    function getOembed(uri, callback) {

        getUrl(uri, {
            maxRedirects: 3
        })
            .on('response', function(res) {
                if (res.statusCode == 200) {

                    stream2oembed(res, function(error, oembed) {
                        if (error) {
                            return callback(error);
                        }

                        var result = {};
                        for(var key in oembed) {
                            var goodKey = key.replace(/-/g, "_");
                            result[goodKey] = oembed[key];
                        }

                        callback(null, result);
                    });

                } else {
                    callback(res.statusCode);
                }
            })
            .on('error', callback);
    }

    function log() {
        if (CONFIG.RICH_LOG_ENABLED) {
            console.log.apply(console, arguments);
        }
    }

})(exports);

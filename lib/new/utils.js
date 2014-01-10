var events = require('events');
var request = require('request');
var zlib = require('zlib');
var iconv = require('iconv-lite');

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
exports.getUrl = function(url, options) {

    var req = new events.EventEmitter();

    var options = options || {
        timeout: 15000,
        maxRedirects: 3
    };

    var jar = options.jar;

    if (!jar) {
        jar = request.jar();
    }

    var buffer = [];
    function bindBodyGetter(stream) {
        stream.on('data', function(chunk) {
            // TODO: why not proxy?
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

                    if (supportGzip && ['gzip', 'deflate'].indexOf(res.headers['content-encoding']) > -1) {

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

exports.getCharset = function(string, doNotParse) {
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

exports.encodeText = function(charset, text) {
    try {
        var b = iconv.encode(text, "ISO8859-1");
        return iconv.decode(b, charset || "UTF-8");
    } catch(e) {
        return text;
    }
}

var lowerCaseKeys = exports.lowerCaseKeys = function(obj) {
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
var tls = require('tls');
var URL = require('url');
var util = require('util');
var http2 = require('http2');
var extend = require('extend');
var now = require('performance-now');
var Request = require('request').Request;

function ExtendedRequest(options) {
    if (!(this instanceof ExtendedRequest)) {
        return new ExtendedRequest(options);
    }

    Request.call(this, options);
}

util.inherits(ExtendedRequest, Request);

ExtendedRequest.prototype.start = function () {
    var self = this;
    // start() is called once we are ready to send the outgoing HTTP request.
    // this is usually called on the first write(), end() or on nextTick()

    if (self.timing) {
        // All timings will be relative to this request's startTime.  In order to do this,
        // we need to capture the wall-clock start time (via Date), immediately followed
        // by the high-resolution timer (via now()).  While these two won't be set
        // at the _exact_ same time, they should be close enough to be able to calculate
        // high-resolution, monotonically non-decreasing timestamps relative to startTime.
        var startTime = new Date().getTime();
        var startTimeNow = now();
    }

    if (self._aborted) {
        return;
    }

    self._started = true;
    self.method = self.method || 'GET';
    self.href = self.uri.href;

    if (self.src && self.src.stat && self.src.stat.size && !self.hasHeader('content-length')) {
        self.setHeader('content-length', self.src.stat.size);
    }
    if (self._aws) {
        self.aws(self._aws, true);
    }

    // We have a method named auth, which is completely different from the http.request
    // auth option.  If we don't remove it, we're gonna have a bad time.
    var reqOptions = copy(self);
    delete reqOptions.auth;

    // node v6.8.0 now supports a `timeout` value in `http.request()`, but we
    // should delete it for now since we handle timeouts manually for better
    // consistency with node versions before v6.8.0
    delete reqOptions.timeout;

    try {
        if (reqOptions.supportHttp2) {
            self.httpModule = http2;
            self.http2Session = self.httpModule.connect(reqOptions);
            self.req = self.http2Session.request({[http2.constants.HTTP2_HEADER_PATH]: reqOptions.path});
        } else {
            self.req = self.httpModule.request(reqOptions);
        }
    } catch (err) {
        self.emit('error', err);
        return;
    }

    if (self.timing) {
        self.startTime = startTime;
        self.startTimeNow = startTimeNow;

        // Timing values will all be relative to startTime (by comparing to startTimeNow
        // so we have an accurate clock)
        self.timings = {};
    }

    var timeout;
    if (self.timeout && !self.timeoutTimer) {
        if (self.timeout < 0) {
            timeout = 0;
        } else if (typeof self.timeout === 'number' && isFinite(self.timeout)) {
            timeout = self.timeout;
        }
    }

    if (reqOptions.supportHttp2) {
        self.req.on('response', self.onRequestResponse.bind(self, self.req));
    } else {
        self.req.on('response', self.onRequestResponse.bind(self));
    }
    self.req.on('error', self.onRequestError.bind(self));
    self.req.on('drain', function () {
        self.emit('drain');
    });

    self.req.on('socket', function (socket) {
        // `._connecting` was the old property which was made public in node v6.1.0
        var isConnecting = socket._connecting || socket.connecting;
        if (self.timing) {
            self.timings.socket = now() - self.startTimeNow;

            if (isConnecting) {
                var onLookupTiming = function () {
                    self.timings.lookup = now() - self.startTimeNow;
                };

                var onConnectTiming = function () {
                    self.timings.connect = now() - self.startTimeNow;
                };

                socket.once('lookup', onLookupTiming);
                socket.once('connect', onConnectTiming);

                // clean up timing event listeners if needed on error
                self.req.once('error', function () {
                    socket.removeListener('lookup', onLookupTiming);
                    socket.removeListener('connect', onConnectTiming);
                });
            }
        }

        var setReqTimeout = function () {
            // This timeout sets the amount of time to wait *between* bytes sent
            // from the server once connected.
            //
            // In particular, it's useful for erroring if the server fails to send
            // data halfway through streaming a response.
            self.req.setTimeout(timeout, function () {
                if (self.req) {
                    self.abort();
                    var e = new Error('ESOCKETTIMEDOUT');
                    e.code = 'ESOCKETTIMEDOUT';
                    e.connect = false;
                    self.emit('error', e);
                }
            });
        };
        if (timeout !== undefined) {
            // Only start the connection timer if we're actually connecting a new
            // socket, otherwise if we're already connected (because this is a
            // keep-alive connection) do not bother. This is important since we won't
            // get a 'connect' event for an already connected socket.
            if (isConnecting) {
                var onReqSockConnect = function () {
                    socket.removeListener('connect', onReqSockConnect);
                    clearTimeout(self.timeoutTimer);
                    self.timeoutTimer = null;
                    setReqTimeout();
                };

                socket.on('connect', onReqSockConnect);

                self.req.on('error', function (err) { // eslint-disable-line handle-callback-err
                    socket.removeListener('connect', onReqSockConnect);
                });

                // Set a timeout in memory - this block will throw if the server takes more
                // than `timeout` to write the HTTP status and headers (corresponding to
                // the on('response') event on the client). NB: this measures wall-clock
                // time, not the time between bytes sent by the server.
                self.timeoutTimer = setTimeout(function () {
                    socket.removeListener('connect', onReqSockConnect);
                    self.abort();
                    var e = new Error('ETIMEDOUT');
                    e.code = 'ETIMEDOUT';
                    e.connect = true;
                    self.emit('error', e);
                }, timeout);
            } else {
                // We're already connected
                setReqTimeout();
            }
        }
        self.emit('socket', socket);
    });

    self.emit('request', self.req);
};

function copy(obj) {
    var o = {};

    Object.keys(obj).forEach(function (i) {
        o[i] = obj[i];
    });

    return o;
}

function initParams(uri, options, callback) {
    if (typeof options === 'function') {
        callback = options;
    }

    var params = {};

    if (typeof options === 'object') {
        extend(params, options, {uri: uri});
    } else if (typeof uri === 'string') {
        extend(params, {uri: uri});
    } else {
        extend(params, uri);
    }

    params.callback = callback || params.callback;

    return params;
}

function paramsHaveRequestBody(params) {
    return (
        params.body ||
        params.requestBodyStream ||
        (params.json && typeof params.json !== 'boolean') ||
        params.multipart
    );
}

module.exports = function request(uri, options, callback) {
    if (typeof uri === 'undefined') {
        throw new Error('undefined is not a valid uri or options object.');
    }

    var params = initParams(uri, options, callback);

    if (params.method === 'HEAD' && paramsHaveRequestBody(params)) {
        throw new Error('HTTP HEAD requests MUST NOT include a request body.');
    }

    var socket = null;
    var parsedUri = URL.parse(uri.uri);
    var secureConnect = parsedUri.protocol ? /^https:?$/i.test(parsedUri.protocol) : false;

    if (secureConnect) {
        socket = tls.connect({
            host              : parsedUri.host,
            port              : parsedUri.port || 443,
            rejectUnauthorized: false,
            ALPNProtocols     : ['h2', 'http/1.1']
        });

        socket.once('secureConnect', function () {
            params.createConnection = function () {
                return socket;
            };
            params.supportHttp2 = socket.alpnProtocol === 'h2';

            return new ExtendedRequest(params);

        });
    } else {
        return new ExtendedRequest(params);
    }
};


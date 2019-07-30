var stream = require('stream');
var util = require('util');
var https = require('https');
// TODO: check support for http2.
var http2 = require('http2');
var tls = require('tls');

// Http2ServerResponseWrapper Class.

// Proxy stream to transfer data from clientHttp2Stream to ClientResponse like object.

// TODO: proxy all events?
// TODO: proxy error?

function Http2Response(clientHttp2Stream) {

    stream.Transform.call(this);

    var that = this;

    clientHttp2Stream.on('response', (headers) => {

        that.statusCode = headers[':status'];
        that.headers = headers;

        that.emit('ready');
    });

    clientHttp2Stream.pipe(this);
}

util.inherits(Http2Response, stream.Transform);

Http2Response.prototype._transform = function (chunk, enc, cb) {
    this.push(chunk);
    cb();
};

// Http2Agent Class

function Http2Agent() {
    https.Agent.call(this);
}

util.inherits(Http2Agent, https.Agent)

Http2Agent.prototype.addRequest = function (req, host, port, localAddress) {
    var that = this;
    var opts;
    if ('object' == typeof host) {
        // >= v0.11.x API
        opts = host;
    } else {
        // <= v0.10.x API
        opts = {
            host: host,
            port: port,
            localAddress: localAddress
        };
    }
  
    // create the `net.Socket` instance
    var info = {
        host: opts.hostname || opts.host,
        port: +opts.port || this.defaultPort,
        localAddress: opts.localAddress
    };

    this.createConnection(
        info,
        function(socket) {
            req.onSocket(socket);
        },
        function(http2Session) {
            that.onHttp2Session(req, http2Session);
        });
};

Http2Agent.prototype.createTlsSocket = function(options) {
    return tls.connect({
        host: options.host,
        port: options.port,
        rejectUnauthorized: false,
        ALPNProtocols: ['h2', 'http/1.1']
    });
};

Http2Agent.prototype.getTlsSocketConnected = function(options, cb) {
    // TODO: socket pool.
    var socket = this.createTlsSocket(options);
    socket.once('secureConnect', function() {
        cb(socket);
    });
}

Http2Agent.prototype.getHttp2Session = function(options) {
    // TODO: socket pool.
    return http2.connect(options);
};

Http2Agent.prototype.onHttp2Session = function(req, http2Session) {
    // TODO: other params? (like cookies).
    var http2Stream = http2Session.request({[http2.constants.HTTP2_HEADER_PATH]: req.path});
    var response = new Http2Response(http2Stream);
    var ready = false;
    response.once('ready', function() {
        ready = true;
        req.emit('response', response);
    });
    // TODO: proxy all events? see http.js onSocket
    // Send initial error.
    // TODO: test error, is this possible case?
    response.once('error', function(error) {
        if (!ready) {
            req.emit('error', err);
        }
    });
};

Http2Agent.prototype.createConnection = function(options, tlsSocketCb, http2SessionCb) {
    var that = this;
    this.getTlsSocketConnected(options, function(socket) {
        var http2 = socket.alpnProtocol === 'h2';
        if (http2) {
            var session = that.getHttp2Session(options);
            http2SessionCb(session);
        } else {
            tlsSocketCb(socket);
        }
    });
}

exports.Http2Agent = Http2Agent;

var globalAgentSSL = new Http2Agent()

// Simple global SSL agent.
exports.getAgent = function(url) {
    if (/^https:/.test(url)) {
        return globalAgentSSL
    } else {
        // undefined agent will force use global default agent.
    }
};
var stream = require('stream');
var util = require('util');
var https = require('https');
// TODO: check support for http2.
var http2 = require('http2');
var tls = require('tls');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

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
    EventEmitter.call(this);
    this.sessions = {};
    this.sockets = {};
}

util.inherits(Http2Agent, https.Agent)

Http2Agent.prototype.getConnectionName = function(options) {
    var name = options.host + ':' + options.port;
    if (options.localAddress) {
        name += ':' + options.localAddress;
    }
    return name;
};

Http2Agent.prototype.addRequest = function(req, host, port, localAddress) {
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
    var socket = tls.connect(_.extend({ 
        ALPNProtocols: ['h2', 'http/1.1']
    }, options));
    return socket;
};

Http2Agent.prototype.getTlsSocketConnected = function(options, cb) {
    var that = this;
    var name = this.getConnectionName(options);
    var socket = this.sockets[name];

    if (!socket) {

        // Create new socket.
        socket = this.createTlsSocket(options);

        // Remove closed socket from pool.
        socket.on('close', function() {
            delete that.sockets[name];
        });

        socket.once('secureConnect', function() {
            socket._secureConnectEmited = true;
            cb(socket);
        });

        this.sockets[name] = socket;

    } else if (socket._secureConnectEmited) {

        // Return existing connected socket.
        cb(socket);

    } else {
        // Wait existing socket to connect.
        socket.once('secureConnect', function() {
            cb(socket);
        });
    }
}

Http2Agent.prototype.getHttp2Session = function(options, socket) {
    var that = this;
    var name = this.getConnectionName(options);
    var session = this.sessions[name]
    
    if (!session) {

        var authority = 'https://' + options.host + ':' + options.port;

        // Create new session.
        session = http2.connect(authority, {
            createConnection: function() {
                // Reuse existing socket.
                return socket;
            }
        });

        // Remove session from pool when closed.
        session.on('close', function() {
            delete that.sessions[name];
        });

        this.sessions[name] = session;
    }

    return session;
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
        if (socket.alpnProtocol === 'h2') {
            var session = that.getHttp2Session(options, socket);
            http2SessionCb(session);
        } else if (socket.alpnProtocol === 'http/1.1') {
            tlsSocketCb(socket);
        } else {
            // TODO: maybe alpnProtocol can be false for other good ssl connections?
            throw new Error('Reposnse protocol "' + socket.alpnProtocol + '" not supported.');
        }
    });
}

exports.Http2Agent = Http2Agent;
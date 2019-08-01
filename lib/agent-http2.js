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
    this.tlsSocketSessions = {};
    this.http2Sessions = {};

    this._nativeHttpsAgent = new https.Agent();
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

    if (!info.servername)
        info.servername = calculateServerName(info, req);

    this.createConnection(
        info,
        // TLS case.
        function(socket) {
            // Reuse native agent.
            // TODO: check if socket reused.
            // TODO: not working: iframely-tests[98761]: ../src/node_crypto.cc:1909:static void node::crypto::SSLWrap<node::TLSWrap>::GetSession(const v8::FunctionCallbackInfo<v8::Value> &) [Base = node::TLSWrap]: Assertion `(slen) > (0)' failed.
            // that._nativeHttpsAgent.addRequest(req, _.extend({}, opts, {
            //     session: socket.getSession()
            // }), port, localAddress);

            that._nativeHttpsAgent.addRequest(req, opts, port, localAddress);
        },
        // HTTP2 case.
        function(http2Session) {
            that.onHttp2Session(req, http2Session);
        });
};

function calculateServerName(options, req) {
    let servername = options.host;
    const hostHeader = req.getHeader('host');
    if (hostHeader) {
        // abc => abc
        // abc:123 => abc
        // [::1] => ::1
        // [::1]:123 => ::1
        if (hostHeader.startsWith('[')) {
            const index = hostHeader.indexOf(']');
            if (index === -1) {
            // Leading '[', but no ']'. Need to do something...
            servername = hostHeader;
            } else {
            servername = hostHeader.substr(1, index - 1);
            }
        } else {
            servername = hostHeader.split(':', 1)[0];
        }
    }
    return servername;
}

Http2Agent.prototype.getTlsSocketConnected = function(options, cb) {
    var that = this;
    var name = this.getConnectionName(options);
    var session = this.tlsSocketSessions[name];

    // Create new socket.
    socket = tls.connect(_.extend({}, options, { 
        // ALPNProtocols: ['h2', 'http/1.1'],
        session: session    // Reuse session.
    }));

    // Evict session on error
    // (from https.js)
    socket.on('close', function(error) {
        if (error) {
            delete that.tlsSocketSessions[name];
        }
    });

    socket.once('secureConnect', function() {
        cb(socket);
    });

    this.tlsSocketSessions[name] = socket.getSession();
}

Http2Agent.prototype.getHttp2Session = function(options, socket) {
    var that = this;
    var name = this.getConnectionName(options);
    var session = this.http2Sessions[name]
    
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
            delete that.http2Sessions[name];
        });

        this.http2Sessions[name] = session;
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
        } else {
            tlsSocketCb(socket);
        }
    });
}

exports.Http2Agent = Http2Agent;
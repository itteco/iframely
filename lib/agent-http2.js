var semver = require('semver');
var https = require('https');
var http2;

if (semver.gte(process.version, '8.13.0')) {

    http2 = require('http2');

} else {

    // Old node without stable http2 support: fallback to https agent. 
    exports.Http2Agent = https.Agent;
    return;
}

var stream = require('stream');
var util = require('util');
var http = require('http');
var tls = require('tls');
var EventEmitter = require('events').EventEmitter;

var sysUtils = require('../logging');

// Http2Response Class.

// Proxy stream to transfer data from clientHttp2Stream to ClientResponse like object.

// TODO: https://github.com/szmarczak/http2-wrapper/blob/master/source/client-request.js#L208
// this.res = new IncomingMessage(this.socket);

function Http2Response(clientHttp2Stream) {

    stream.Transform.call(this);

    var that = this;

    this.clientHttp2Stream = clientHttp2Stream;

    clientHttp2Stream.on('response', (headers) => {

        that.statusCode = headers[':status'];
        that.headers = headers;

        that.emit('ready');
    });

    clientHttp2Stream.on('error', function(error) {
        that.emit('error', error);
    });

    clientHttp2Stream.on('aborted', function() {
        that.emit('aborted');
    });

    clientHttp2Stream.on('timeout', function() {
        that.emit('timeout');
    });

    clientHttp2Stream.pipe(this);

    // Mark as http2 response for debugger.
    this.h2 = true;
}

util.inherits(Http2Response, stream.Transform);

Http2Response.prototype.abort = function() {
    // Stopping Transform stream causes 'FLOW' errors.
    // .close method causes error: ../src/nodehttp2.cc:893:ssize_t node::http2::Http2Session::ConsumeHTTP2Data(): Assertion `(flags & SESSION_STATE_READING_STOPPED) != (0)' failed.
    // .destroy method works ok.
    if (!this.clientHttp2Stream.destroyed) {
        this.clientHttp2Stream.destroy();
    }
}

Http2Response.prototype._destroy = function(err, cb) {
    this.clientHttp2Stream.destroy();
    stream.Transform.prototype._destroy.call(this, err, (err2) => {
        cb(err2);
    });
};

Http2Response.prototype._dump = http.IncomingMessage.prototype._dump;

Http2Response.prototype._transform = function (chunk, enc, cb) {
    this.push(chunk);
    cb();
};

// Http2Agent Class

function Http2Agent(options) {

    if (!(this instanceof Http2Agent))
        return new Http2Agent(options);

    EventEmitter.call(this);

    this.defaultPort = 443;
    this.protocol = 'https:';

    this.options = Object.assign({}, options);

    // Prevent warnings on many listeners.
    this.setMaxListeners(1000);

    this.tlsSockets = {};
    this.http2Sessions = {};
    this.alpnProtocolCache = {};

    this._nativeHttpsAgent = new CustomHttpsAgent(options);
}

util.inherits(Http2Agent, https.Agent)

Http2Agent.prototype.getConnectionName = function(options) {
    var name = options.host + ':' + options.port;
    if (options.localAddress) {
        name += ':' + options.localAddress;
    }
    return name;
};

Http2Agent.prototype.addRequest = function(req, options, port/* legacy */,
                                           localAddress/* legacy */) {

    if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
        throw new Error('Unsupported request method ' + req.method + '. Use only GET or HEAD.');
    }

    var that = this;

    // Legacy API: addRequest(req, host, port, localAddress)
    if (typeof options === 'string') {
        options = {
            host: options,
            port,
            localAddress
        };
    }

    // Rewrite options, remove non used data, http2.connect will not accept it.
    options = {
        host: options.hostname || options.host,
        port: +options.port || this.defaultPort,
        localAddress: options.localAddress
    };

    Object.assign(options, this.options);
    if (options.socketPath)
      options.path = options.socketPath;
  
    if (!options.servername)
      options.servername = calculateServerName(options, req);

    this.createConnection(
        options,
        // TLS case.
        function(socket) {
            // Reuse native agent.
            that._nativeHttpsAgent.addRequest(req, Object.assign(options, {
                socket: socket
            }), port, localAddress);
        },
        // HTTP2 case.
        function(http2Session) {
            that.onHttp2Session(req, options, http2Session);
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
    var socket = this.tlsSockets[name];
    var alpnProtocol = this.alpnProtocolCache[name];
    var hasAlpnProtocolCache = name in this.alpnProtocolCache;

    var eventName = 'tlsSocketConnected-' + name;

    if (!socket && !hasAlpnProtocolCache) {
        // Create new socket.
        // Socket will be used for one https request in native https agent.
        socket = tls.connect(Object.assign({}, options, { 
            ALPNProtocols: ['h2', 'http/1.1']
        }), function() {
            socket._connected = true;

            // Cache alpn protocol.
            that.alpnProtocolCache[name] = socket.alpnProtocol;

            cb(socket, socket.alpnProtocol);

            // Do not pass socket to other requests.
            that.emit(eventName, null, socket.alpnProtocol);
        });

        that.tlsSockets[name] = socket;
        
        socket.once('close', function() {
            delete that.tlsSockets[name];
        });

        // Error occurs on connect:
        // ENOTFOUND
        // ERR_TLS_CERT_ALTNAME_INVALID
        // Error: read ECONNRESET
        // Fallback to native agent.
        socket.once('error', function(error) {
            delete that.tlsSockets[name];
            if (!(error.code in CONFIG.HTTP2_RETRY_CODES)) {
                // Cache no alpn protocol.
                // No further h2 requests on this domain.
                that.alpnProtocolCache[name] = null;
            }
            cb(null, null);
        });

        // TODO: what to do on error?

    } else if (socket && !socket._connected && !hasAlpnProtocolCache) {

        // Socket created, but not connected.

        // Wait connecting socket.
        this.once(eventName, cb);

    } else {

        cb(null, alpnProtocol);
    }
};

Http2Agent.prototype.getHttp2SessionFromCache = function(options) {
    var name = this.getConnectionName(options);
    var session = this.http2Sessions[name];
    return session;
};

Http2Agent.prototype.getHttp2Session = function(options, socket) {
    var name = this.getConnectionName(options);
    var session = this.getHttp2SessionFromCache(options);
    
    if (!session) {

        var authority = 'https://' + options.host + ':' + options.port;

        // Create new session.
        var connectOptions = {};
        if (socket) {
            connectOptions.createConnection = function() {
                // Reuse existing socket.
                return socket;
            };
        }
        session = http2.connect(authority, connectOptions);

        session.settings({ enablePush: false });

        this.addSession(name, session);
    }

    return session;
};

Http2Agent.prototype.addSession = function(name, session) {

    var that = this;

    this.http2Sessions[name] = session;

    function removeSession() {
        that.removeSession(name, session);
    }
    // Remove session from pool when closed.
    session.on('close', removeSession);
    session.on('goaway', removeSession);
    session.on('error', removeSession);
    session.on('frameError', removeSession);
    session.on('timeout', removeSession);
};

Http2Agent.prototype.removeSession = function(name, session) {
    delete this.http2Sessions[name];
    try {
        if (!session.closed) {
            session.close(function() {
                session.destroy();
            });
        } else {
            session.destroy();
        }
    } catch(ex) {
    }
    session.removeAllListeners('close');
    session.removeAllListeners('goaway');
    session.removeAllListeners('error');
    session.removeAllListeners('frameError');
    session.removeAllListeners('timeout');
}

Http2Agent.prototype.onHttp2Session = function(req, options, http2Session) {
    // TODO: test cookies (can be array)
    
    var authority = options.host;
    if (options.port !== this.defaultPort) {
        authority += ':' + options.port;
    }

    var headers = {
        [http2.constants.HTTP2_HEADER_PATH]: req.path,
        [http2.constants.HTTP2_HEADER_METHOD]: req.method,
        [http2.constants.HTTP2_HEADER_AUTHORITY]: authority,
        [http2.constants.HTTP2_HEADER_SCHEME]: 'https'
    };
    Object.assign(headers, req.getHeaders());
    // Prevent ERR_HTTP2_INVALID_CONNECTION_HEADERS.
    delete headers.host;
    delete headers.connection;

    var http2Stream = http2Session.request(headers, {
        endStream: true
    });
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
            req.emit('error', error, {h2: true});
        }
    });
};

Http2Agent.prototype.createConnection = function(options, tlsSocketCb, http2SessionCb) {
    var that = this;
    var cachedHttp2session = this.getHttp2SessionFromCache(options);
    if (cachedHttp2session) {
        http2SessionCb(cachedHttp2session);
        return;
    }

    this.getTlsSocketConnected(options, function(socket, alpnProtocol) {
        // socket can be null.
        if (alpnProtocol === 'h2') {
            cachedHttp2session = that.getHttp2Session(options, socket);
            http2SessionCb(cachedHttp2session);
        } else {
            tlsSocketCb(socket);
        }
    });
};

exports.Http2Agent = Http2Agent;



// HTTPS agents. Copy from https.js.

const { inherits } = util;

function createConnection(port, host, options) {
    if (port !== null && typeof port === 'object') {
      options = port;
    } else if (host !== null && typeof host === 'object') {
      options = host;
    } else if (options === null || typeof options !== 'object') {
      options = {};
    }
  
    if (options.socket) {

        // Force reuse socket.

        var socket = options.socket;
        this._cacheSession(options._agentKey, socket.getSession());

        // Evict session on error
        socket.once('close', (err) => {
            if (err) {
                this._evictSession(options._agentKey);
            }
        });

        return socket;

    } else {

        // Call https native method.
        return https.Agent.prototype.createConnection.call(this, port, host, options);
    }
}
  
function CustomHttpsAgent(options) {
    https.Agent.call(this, options);
}
inherits(CustomHttpsAgent, https.Agent);
CustomHttpsAgent.prototype.createConnection = createConnection;
  
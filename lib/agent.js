var net = require('net');
var tls = require('tls');
var URL = require('url');
var http2 = require('http2');
var inherits = require('util').inherits;
var HttpAgent = require('forever-agent');
var HttpsAgent = require('forever-agent').SSL;

var Http2ServerResponseWrapper = require('./agent-http2').Http2ServerResponseWrapper;

function Agent (options) {
    var url = null;

    if (!options && !options.hasOwnProperty('uri')) {
        throw new Error('a `uri` must be specified!');
    }

    try {
        url = URL.parse(options.uri, true);
    } catch (e) {
        throw new Error('a `uri` must be valid!');
    }

    if(url.protocol === 'http:') {
        return new HttpAgent(options);
    }

    if (!(this instanceof Agent)) {
        return new Agent(options);
    }

    HttpsAgent.call(this, options);

    this.init(url, options);
}

inherits(Agent, HttpsAgent);

Agent.prototype.init = function init(url, options) {
    var self = this;

    self.state = {};
    self.options = options || {};

    self.options.host = url.host;
    self.options.protocol = url.protocol;
    self.options.port = url.protocol === 'http:' ? 80 : 443;

    self.requests = {};
    self.sockets = {};
    self.freeSockets = {};
    self.maxSockets = self.options.maxSockets || Agent.defaultMaxSockets;
    self.minSockets = self.options.minSockets || HttpsAgent.defaultMinSockets;
    self.on('free', function(socket, host, port) {
        var name = getConnectionName(host, port);

        if (self.requests[name] && self.requests[name].length) {
            self.requests[name].shift().onSocket(socket)
        } else if (self.sockets[name].length < self.minSockets) {
            if (!self.freeSockets[name]) self.freeSockets[name] = [];
            self.freeSockets[name].push(socket);

            // if an error happens while we don't use the socket anyway, meh, throw the socket away
            var onIdleError = function() {
                socket.destroy();
            };
            socket._onIdleError = onIdleError;
            //socket.on('error', onIdleError);
        } else {
            // If there are no pending requests just destroy the
            // socket and it will get removed from the pool. This
            // gets us out of timeout issues and allows us to
            // default to Connection:keep-alive.
            //socket.destroy();
        }
    });
};

Agent.prototype.createConnection = function createConnection(options, callback) {
    var self = this;
    var socket = null;
    var secureConnect = options.protocol ? /^https:?$/i.test(options.protocol) : false;

    if (secureConnect) {
        socket = tls.connect({
            host: options.host,
            port: options.port || 443,
            rejectUnauthorized: false,
            ALPNProtocols: ['h2', 'http/1.1']
        });

        socket.once('secureConnect', function () {
            self.state.supportHttp2 = socket.alpnProtocol === 'h2';

            if(self.state.supportHttp2) {
                var session = http2.connect(options);
                callback(null, session);
            } else {
                callback(null, socket);
            }
        });
    } else {
        socket = net.connect(options);
        callback(null, socket);
    }
};

Agent.prototype.addRequest = function addRequest(req, options, port, localAddress) {
    
    var self = this;

    self.createConnection(self.options, function (err, connection) {
        if (err) {
            self.emit('error', err);
        }

        if (self.state.supportHttp2) {
            handleHttp2Session(self, req, connection);
        } else {
            setRequestSocket(self, req, connection);
        }
    });
};

function handleHttp2Session(agent, request, http2Session) {
    var http2Stream = http2Session.request({[http2.constants.HTTP2_HEADER_PATH]: request.path});

    var response = new Http2ServerResponseWrapper(http2Stream);
    response.on('ready', function() {
        request.emit('response', response);
    });

    // TODO: ???
    http2Stream.on('error', function (err) {
        request.emit('error', err);
    });

    // TODO: ???
    http2Stream.on('end', function () {
        //http2Session.destroy();
    });
}

function setRequestSocket(agent, req, socket) {
    req.onSocket(socket);

    var agentTimeout = agent.options.timeout || 0;

    if (req.timeout === undefined || req.timeout === agentTimeout) {
        return;
    }

    socket.setTimeout(req.timeout);
    // Reset timeout after response end
    req.once('response', function(res) {
        console.log('response', JSON.stringify(res));
        res.once('end', function() {
            if (socket.timeout !== agentTimeout) {
                socket.setTimeout(agentTimeout);
            }
        });
    });
}

function getConnectionName(host, port) {
    var name = '';

    if (typeof host === 'string') {
        name = host + ':' + port;
    } else {
        // For node.js v012.0 and iojs-v1.5.1, host is an object. And any existing localAddress is part of the connection name.
        name = host.host + ':' + host.port + ':' + (host.localAddress ? (host.localAddress + ':') : ':');
    }

    return name;
}

module.exports = Agent;

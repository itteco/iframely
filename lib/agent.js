var net = require('net');
var tls = require('tls');
var http2 = require('http2');
var inherits = require('util').inherits;
var ForeverAgent = require('forever-agent');
var ondrain = require('http').ondrain;
var httpDeceiver = require('./deceiver');
var debug = require('_http_common').debug;
var freeParser = require('_http_common').freeParser;
var httpSocketSetup = require('_http_common').httpSocketSetup;
var parsers = require('_http_common').parsers;
var HTTPParser = require('_http_common').HTTPParser;

var state = {};

function Agent (options) {
    if (!options && !options.hasOwnProperty('host') && !options.hasOwnProperty('protocol')) {
        throw new Error('a `protocol` and `host` must be specified!');
    }

    if (!(this instanceof Agent)) {
        return new Agent(options);
    }

    ForeverAgent.call(this, options);

    state.options = options;
}

inherits(Agent, ForeverAgent);

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
            state.supportHttp2 = socket.alpnProtocol === 'h2';
        });
    } else {
        socket = net.connect(options);
    }

    callback(null, socket);
};

Agent.prototype.addRequest = function addRequest(req, options, port/* legacy */,
                                                 localAddress/* legacy */) {
    // Legacy API: addRequest(req, host, port, localAddress)
    if (typeof options === 'string') {
        options = {
            host: options,
            port,
            localAddress
        };
    }

    options = Object.assign(options, this.options);
    if (options.socketPath)
        options.path = options.socketPath;

    if (!options.servername && options.servername !== '')
        options.servername = calculateServerName(options, req);

    var name = this.getName(options);
    if (!this.sockets[name]) {
        this.sockets[name] = [];
    }

    var freeLen = this.freeSockets[name] ? this.freeSockets[name].length : 0;
    var sockLen = freeLen + this.sockets[name].length;

    if (sockLen < this.maxSockets) {
        // If we are under maxSockets create a new one.
        this.createSocket(req, options, handleSocketCreation(this, req, true));
    } else {
        // We are over limit so we'll add it to the queue.
        if (!this.requests[name]) {
            this.requests[name] = [];
        }
        this.requests[name].push(req);
    }
};

function handleSocketCreation(agent, request, informRequest) {
    return function handleSocketCreation_Inner(err, socket) {
        if (err) {
            process.nextTick(emitErrorNT, request, err);
            return;
        }
        if (informRequest)
            setRequestSocket(agent, request, socket);
        else
            socket.emit('free');
    };
}

function setRequestSocket(agent, req, socket) {
    onSocket(req, socket);
    var agentTimeout = agent.options.timeout || 0;
    if (req.timeout === undefined || req.timeout === agentTimeout) {
        return;
    }
    socket.setTimeout(req.timeout);
    // Reset timeout after response end
    req.once('response', function (res) {
        res.once('end', function () {
            if (socket.timeout !== agentTimeout) {
                socket.setTimeout(agentTimeout);
            }
        });
    });
}

function onSocket(req, socket) {
    process.nextTick(onSocketNT, req, socket);
}

function onSocketNT(req, socket) {
    if (req.aborted) {
        // If we were aborted while waiting for a socket, skip the whole thing.
        if (!req.agent) {
            socket.destroy();
        } else {
            socket.emit('free');
        }
    } else {
        tickOnSocket(req, socket);
    }
}

function tickOnSocket(req, socket) {
    var parser = parsers.alloc();
    req.socket = socket;
    req.connection = socket;
    parser.initialize(HTTPParser.RESPONSE,
        new HTTPClientAsyncResource('HTTPINCOMINGMESSAGE', req));
    parser.socket = socket;
    parser.outgoing = req;
    req.parser = parser;

    socket.parser = parser;
    socket._httpMessage = req;

    var deceiver = httpDeceiver.create(socket, {isClient: true, parser: parser});

    var session = http2.connect(state.options);
    var http2Stream = session.request({[http2.constants.HTTP2_HEADER_PATH]: '/'});

    http2Stream.on('response', function(status, headers) {
        deceiver.emitResponse({
            status: status,
            headers: headers
        });
    });

    // Setup "drain" propagation.
    httpSocketSetup(socket);

    // Propagate headers limit from request object to parser
    if (typeof req.maxHeadersCount === 'number') {
        parser.maxHeaderPairs = req.maxHeadersCount << 1;
    }

    parser.onIncoming = parserOnIncomingClient;
    socket.removeListener('error', freeSocketErrorListener);
    socket.on('error', socketErrorListener);
    socket.on('data', socketOnData);
    socket.on('end', socketOnEnd);
    socket.on('close', socketCloseListener);

    if (req.timeout !== undefined || (req.agent && req.agent.options && req.agent.options.timeout)) {
        listenSocketTimeout(req);
    }
    req.emit('socket', socket);
}

function listenSocketTimeout(req) {
    if (req.timeoutCb) {
        return;
    }
    var emitRequestTimeout = function () { req.emit('timeout') };
    // Set timeoutCb so it will get cleaned up on request end.
    req.timeoutCb = emitRequestTimeout;
    // Delegate socket timeout event.
    if (req.socket) {
        req.socket.once('timeout', emitRequestTimeout);
    } else {
        req.on('socket', function (socket) {
            socket.once('timeout', emitRequestTimeout);
        });
    }
    // Remove socket timeout listener after response end.
    req.once('response', function (res) {
        res.once('end', function () {
            req.socket.removeListener('timeout', emitRequestTimeout);
        });
    });
}

function parserOnIncomingClient(res, shouldKeepAlive) {
    var socket = this.socket;
    var req = socket._httpMessage;

    if (req.res) {
        // We already have a response object, this means the server
        // sent a double response.
        socket.destroy();
        return 0;  // No special treatment.
    }
    req.res = res;

    // Skip body and treat as Upgrade.
    if (res.upgrade)
        return 2;

    // Responses to CONNECT request is handled as Upgrade.
    var method = req.method;
    if (method === 'CONNECT') {
        res.upgrade = true;
        return 2;  // Skip body and treat as Upgrade.
    }

    if (statusIsInformational(res.statusCode)) {
        // Restart the parser, as this is a 1xx informational message.
        req.res = null; // Clear res so that we don't hit double-responses.
        // Maintain compatibility by sending 100-specific events
        if (res.statusCode === 100) {
            req.emit('continue');
        }
        // Send information events to all 1xx responses except 101 Upgrade.
        req.emit('information', { statusCode: res.statusCode });

        return 1;  // Skip body but don't treat as Upgrade.
    }

    if (req.shouldKeepAlive && !shouldKeepAlive && !req.upgradeOrConnect) {
        // Server MUST respond with Connection:keep-alive for us to enable it.
        // If we've been upgraded (via WebSockets) we also shouldn't try to
        // keep the connection open.
        req.shouldKeepAlive = false;
    }

    req.res = res;
    res.req = req;

    // Add our listener first, so that we guarantee socket cleanup
    res.on('end', responseOnEnd);
    req.on('prefinish', requestOnPrefinish);
    var handled = req.emit('response', res);

    // If the user did not listen for the 'response' event, then they
    // can't possibly read the data, so we ._dump() it into the void
    // so that the socket doesn't hang there in a paused state.
    if (!handled)
        res._dump();

    if (method === 'HEAD')
        return 1;  // Skip body but don't treat as Upgrade.

    return 0;  // No special treatment.
}

function emitErrorNT(emitter, err) {
    emitter.emit('error', err);
}

function calculateServerName(options, req) {
    var servername = options.host;
    var hostHeader = req.getHeader('host');
    if (hostHeader) {
        // abc => abc
        // abc:123 => abc
        // [::1] => ::1
        // [::1]:123 => ::1
        if (hostHeader.startsWith('[')) {
            var index = hostHeader.indexOf(']');
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
    // Don't implicitly set invalid (IP) servernames.
    if (net.isIP(servername)) {
        servername = '';
    }

    return servername;
}

function installListeners(agent, s, options) {
    function onFree() {
        agent.emit('free', s, options);
    }
    s.on('free', onFree);

    function onClose() {
        // This is the only place where sockets get removed from the Agent.
        // If you want to remove a socket from the pool, just close it.
        // All socket errors end in a close event anyway.
        agent.removeSocket(s, options);
    }
    s.on('close', onClose);

    function onRemove() {
        // We need this function for cases like HTTP 'upgrade'
        // (defined by WebSockets) where we need to remove a socket from the
        // pool because it'll be locked up indefinitely
        agent.removeSocket(s, options);
        s.removeListener('close', onClose);
        s.removeListener('free', onFree);
        s.removeListener('agentRemove', onRemove);
    }
    s.on('agentRemove', onRemove);
}

class HTTPClientAsyncResource {
    constructor(type, req) {
        this.type = type;
        this.req = req;
    }
}

function statusIsInformational(status) {
    // 100 (Continue)    RFC7231 Section 6.2.1
    // 102 (Processing)  RFC2518
    // 103 (Early Hints) RFC8297
    // 104-199 (Unassigned)
    return (status < 200 && status >= 100 && status !== 101);
}

function responseOnEnd() {
    var res = this;
    var req = this.req;

    req._ended = true;
    if (!req.shouldKeepAlive || req.finished)
        responseKeepAlive(res, req);
}

function responseKeepAlive(res, req) {
    var socket = req.socket;

    if (!req.shouldKeepAlive) {
        if (socket.writable) {
            if (typeof socket.destroySoon === 'function')
                socket.destroySoon();
            else
                socket.end();
        }
        assert(!socket.writable);
    } else {
        if (req.timeoutCb) {
            socket.setTimeout(0, req.timeoutCb);
            req.timeoutCb = null;
        }
        socket.removeListener('close', socketCloseListener);
        socket.removeListener('error', socketErrorListener);
        socket.once('error', freeSocketErrorListener);
        // There are cases where _handle === null. Avoid those. Passing null to
        // nextTick() will call getDefaultTriggerAsyncId() to retrieve the id.
        var asyncId = socket._handle ? socket._handle.getAsyncId() : undefined;
        // Mark this socket as available, AFTER user-added end
        // handlers have a chance to run.
        defaultTriggerAsyncIdScope(asyncId, process.nextTick, emitFreeNT, socket);
    }
}

function freeSocketErrorListener(err) {
    var socket = this;
    socket.destroy();
    socket.emit('agentRemove');
}

function socketErrorListener(err) {
    var socket = this;
    var req = socket._httpMessage;

    if (req) {
        // For Safety. Some additional errors might fire later on
        // and we need to make sure we don't double-fire the error event.
        req.socket._hadError = true;
        req.emit('error', err);
    }

    // Handle any pending data
    socket.read();

    var parser = socket.parser;
    if (parser) {
        parser.finish();
        freeParser(parser, req, socket);
    }

    // Ensure that no further data will come out of the socket
    socket.removeListener('data', socketOnData);
    socket.removeListener('end', socketOnEnd);
    socket.destroy();
}

function socketOnData(d) {
    var socket = this;
    var req = this._httpMessage;
    var parser = this.parser;

    var ret = parser.execute(d);
    if (ret instanceof Error) {
        freeParser(parser, req, socket);
        socket.destroy();
        req.socket._hadError = true;
        req.emit('error', ret);
    } else if (parser.incoming && parser.incoming.upgrade) {
        // Upgrade (if status code 101) or CONNECT
        var bytesParsed = ret;
        var res = parser.incoming;
        req.res = res;

        socket.removeListener('data', socketOnData);
        socket.removeListener('end', socketOnEnd);
        socket.removeListener('drain', ondrain);
        parser.finish();
        freeParser(parser, req, socket);

        var bodyHead = d.slice(bytesParsed, d.length);

        var eventName = req.method === 'CONNECT' ? 'connect' : 'upgrade';
        if (req.listenerCount(eventName) > 0) {
            req.upgradeOrConnect = true;

            // detach the socket
            socket.emit('agentRemove');
            socket.removeListener('close', socketCloseListener);
            socket.removeListener('error', socketErrorListener);

            socket._httpMessage = null;
            socket.readableFlowing = null;

            req.emit(eventName, res, socket, bodyHead);
            req.emit('close');
        } else {
            // Requested Upgrade or used CONNECT method, but have no handler.
            socket.destroy();
        }
    } else if (parser.incoming && parser.incoming.complete &&
        // When the status code is informational (100, 102-199),
        // the server will send a final response after this client
        // sends a request body, so we must not free the parser.
        // 101 (Switching Protocols) and all other status codes
        // should be processed normally.
        !statusIsInformational(parser.incoming.statusCode)) {
        socket.removeListener('data', socketOnData);
        socket.removeListener('end', socketOnEnd);
        freeParser(parser, req, socket);
    }
}

function socketOnEnd() {
    var socket = this;
    var req = this._httpMessage;
    var parser = this.parser;

    if (!req.res && !req.socket._hadError) {
        // If we don't have a response then we know that the socket
        // ended prematurely and we need to emit an error on the request.
        req.socket._hadError = true;
        req.emit('error', createHangUpError());
    }
    if (parser) {
        parser.finish();
        freeParser(parser, req, socket);
    }
    socket.destroy();
}

function socketCloseListener() {
    var socket = this;
    var req = socket._httpMessage;
    debug('HTTP socket close');

    // Pull through final chunk, if anything is buffered.
    // the ondata function will handle it properly, and this
    // is a no-op if no final chunk remains.
    socket.read();

    // NOTE: It's important to get parser here, because it could be freed by
    // the `socketOnData`.
    var parser = socket.parser;
    var res = req.res;
    if (res) {
        // Socket closed before we emitted 'end' below.
        if (!res.complete) {
            res.aborted = true;
            res.emit('aborted');
        }
        req.emit('close');
        if (res.readable) {
            res.on('end', function() {
                this.emit('close');
            });
            res.push(null);
        } else {
            res.emit('close');
        }
    } else {
        if (!req.socket._hadError) {
            // This socket error fired before we started to
            // receive a response. The error needs to
            // fire on the request.
            req.socket._hadError = true;
            req.emit('error', createHangUpError());
        }
        req.emit('close');
    }

    // Too bad.  That output wasn't getting written.
    // This is pretty terrible that it doesn't raise an error.
    // Fixed better in v0.10
    if (req.outputData)
        req.outputData.length = 0;

    if (parser) {
        parser.finish();
        freeParser(parser, req, socket);
    }
}

function createHangUpError() {
    // eslint-disable-next-line no-restricted-syntax
    var error = new Error('socket hang up');
    error.code = 'ECONNRESET';
    return error;
}


module.exports = Agent;

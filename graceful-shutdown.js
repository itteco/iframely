var EventEmitter = require('events').EventEmitter;

module.exports = function(options) {

    var server = options.server;

    if (!server) {
        throw new Error('Graceful shutdown: `options.server` required.');
    }

    var log = options.log || console.log;
    var shutdownTimeout = options.shutdownTimeout || 5000;

    // Solution got from: https://github.com/nodejs/node-v0.x-archive/issues/9066#issuecomment-124210576

    var state = new EventEmitter;
    state.setMaxListeners(0);
    state.shutdown = false;

    var REQUESTS_COUNT = 0;

    server.on('connection', function (socket) {
        function destroy() {
            if (socket._GS_HAS_OPEN_REQUESTS === 0) socket.destroy();
        }
        socket._GS_HAS_OPEN_REQUESTS = 0;
        state.once('shutdown', destroy);
        socket.once('close', function () {
            state.removeListener('shutdown', destroy);
        });
    });

    server.on('request', function (req, res) {
        var socket = req.connection;
        socket._GS_HAS_OPEN_REQUESTS++;
        REQUESTS_COUNT++;
        res.on('finish', function () {
            REQUESTS_COUNT--;
            if (state.shutdown) logShutdown();
            socket._GS_HAS_OPEN_REQUESTS--;
            if (state.shutdown && socket._GS_HAS_OPEN_REQUESTS === 0) socket.destroy();
        });
    });

    // Bind to termination events.

    function logShutdown() {
        log('pid:' + process.pid + ' graceful stutdown: ' + (REQUESTS_COUNT ? 'wait ' + REQUESTS_COUNT + ' request' + (REQUESTS_COUNT > 1 ? 's': '') + ' to finish.' : 'done.'));
    }

    function gracefulExit() {

        logShutdown();

        setTimeout(function() {
            log('pid:' + process.pid + ' graceful stutdown: timeout, force exit.');
            process.exit(0);
        }, shutdownTimeout);

        server.close(function() {
            process.exit(0);
        });

        state.shutdown = true;
        state.emit('shutdown');
    }
    process.on('SIGTERM', gracefulExit);
    process.on('SIGINT', gracefulExit);
};
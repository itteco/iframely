var sysUtils = require('./utils');
var EventEmitter = require('events').EventEmitter;

module.exports = function(server) {

    // Solution got from: https://github.com/nodejs/node-v0.x-archive/issues/9066#issuecomment-124210576

    var state = new EventEmitter;
    state.setMaxListeners(0);
    state.shutdown = false;

    var REQUESTS_COUNT = 0;

    server.shutdown = function () {
        server.close(function() {
            process.exit(0);
        });
        state.shutdown = true;
        state.emit('shutdown');
    };
    server.on('connection', function (socket) {
        function destroy() {
            if (socket.HAS_OPEN_REQUESTS === 0) socket.destroy();
        }
        socket.HAS_OPEN_REQUESTS = 0;
        state.once('shutdown', destroy);
        socket.once('close', function () {
            state.removeListener('shutdown', destroy);
        });
    });
    server.on('request', function (req, res) {
        var socket = req.connection;
        socket.HAS_OPEN_REQUESTS++;
        REQUESTS_COUNT++;
        res.on('finish', function () {
            REQUESTS_COUNT--;
            if (state.shutdown) logShutdown();
            socket.HAS_OPEN_REQUESTS--;
            if (state.shutdown && socket.HAS_OPEN_REQUESTS === 0) socket.destroy();
        });
    });

    // Bind to termination events.

    function logShutdown() {
        sysUtils.log('pid:' + process.pid + ' graceful stutdown: ' + (REQUESTS_COUNT ? 'wait ' + REQUESTS_COUNT + ' requests to finish.' : 'done.'));
    }

    function gracefulExit() {
        logShutdown();
        server.shutdown();
    }
    process.on('SIGTERM', gracefulExit);
    process.on('SIGINT', gracefulExit);

};
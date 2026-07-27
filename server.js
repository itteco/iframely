// Entrypoint for the standalone run modes:
//   - plain `node server.js` (open-source installs) — just listens
//   - pm2 / cluster.js — legacy GracefulServer shutdown
// Supervised worker deployments run an EXTERNAL entrypoint instead,
// which imports this module and wires drain/readiness/watchdog around
// the listener. This module's side of that contract is passive: it
// exposes the listener as `global.__listener`, /health_check returns
// 503 while `global.__draining` is set, and the legacy shutdown
// handler stays off when INSTANCE is set.

// Optional Sentry (no-op without the linked module + config field).
import './instrument.js';
import { GracefulServer } from 'graceful-cluster';
import * as sysUtils from './utils.js';
import app from './app.js';
import *  as https from 'https';

var server = app.listen(process.env.PORT || CONFIG.port, process.env.HOST || CONFIG.host, function(){
    console.log('\niframely is running on ' + server.address().address + ':' + server.address().port);
    console.log('API endpoints: /oembed and /iframely; Debugger UI: /debug\n');
});

// Contract with external worker supervisors (see header).
global.__listener = server;

if (CONFIG.ssl) {
    https.createServer(CONFIG.ssl, app).listen(CONFIG.ssl.port);
}

console.log('');
console.log(' - support@iframely.com - if you need help');
console.log(' - twitter.com/iframely - news & updates');
console.log(' - github.com/itteco/iframely - star & contribute');

// INSTANCE is set only under supervised worker deployments, where an
// external entrypoint owns shutdown/readiness around the exposed
// listener — the legacy handler must not also react to signals there.
if (process.env.INSTANCE === undefined && !CONFIG.DEBUG) {
    // Legacy graceful shutdown for the pm2 / standalone paths.
    // Deliberately a STATIC import (top of file): the constructor
    // registers the SIGTERM/SIGINT handlers, and an `await import`
    // here would (a) widen the unguarded-signal window after listen()
    // and (b) make this module async (`require()` consumers would get
    // ERR_REQUIRE_ASYNC_MODULE). graceful-cluster is a real
    // package.json dependency — nothing to gain from lazy loading.
    new GracefulServer({
        server: server,
        log: sysUtils.log,
        shutdownTimeout: CONFIG.SHUTDOWN_TIMEOUT
    });
}

// Optional Sentry — covers the cluster MASTER; workers re-import via
// server.js (module cache dedups). No-op on open-source installs.
import './instrument.js';
import { GracefulCluster } from 'graceful-cluster';
import * as sysUtils from './utils.js';

process.title = 'iframely-cluster';

GracefulCluster.start({
    log: sysUtils.log,
    shutdownTimeout: CONFIG.SHUTDOWN_TIMEOUT,
    disableGraceful: CONFIG.DEBUG,
    restartOnTimeout: CONFIG.CLUSTER_WORKER_RESTART_ON_PERIOD,
    restartOnMemory: CONFIG.CLUSTER_WORKER_RESTART_ON_MEMORY_USED,
    serverFunction: function() {
        import('./server.js');
    }
});

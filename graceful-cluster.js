var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var GracefulCluster = module.exports;

/*

Starts node.js cluster with graceful restart/shutdown.

Params:

    - options.serverFunction        - required, function with worker logic.
    - options.log                   - function, custom log function, console.log used by default.
    - options.shutdownTimeout       - ms, force worker shutdown on SIGTERM timeout.
    - options.disableGraceful       - disable graceful shutdown for faster debug.
    - options.restartOnMemory       - bytes, restart worker on memory usage.
    - options.restartOnTimeout      - ms, restart worker by timer.

Graceful restart performed by USR2 signal:

    pkill -USR2 <cluster_process_name>

or

    kill -s SIGUSR2 <cluster_pid>

 */
GracefulCluster.start = function(options) {

    var serverFunction = options.serverFunction;

    if (!serverFunction) {
        throw new Error('Graceful cluster: `options.serverFunction` required.');
    }

    var log = options.log || console.log;
    var shutdownTimeout = options.shutdownTimeout || 5000;
    var disableGraceful = options.disableGraceful;

    if (cluster.isMaster) {

        var sigkill = false;
        var workersCount = 0;
        var listeningWorkersCount = 0;
        var restartQueue = [];

        // Prevent killing all workers at same time when restarting.
        function checkRestartQueue() {
            // Kill one worker only if maximum count are working.
            if (restartQueue.length > 0 && listeningWorkersCount === numCPUs) {
                var pid = restartQueue.shift();
                try {
                    // Send SIGTERM signal to worker. SIGTERM starts graceful shutdown of worker inside it.
                    process.kill(pid);
                } catch(ex) {
                    // Fail silent on 'No such process'. May occur when kill message received after kill initiated but not finished.
                    if (ex.code !== 'ESRCH') {
                        throw ex;
                    }
                }
            }
        }

        // Create fork with 'on restart' message event listener.
        function fork() {
            cluster.fork().on('message', function(message) {
                if (message.cmd === 'restart' && message.pid && restartQueue.indexOf(message.pid) === -1) {
                    // When worker asks to restart gracefully in cluster, then add it to restart queue.
                    restartQueue.push(message.pid);
                    checkRestartQueue();
                }
            });
        }

        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            fork();
        }

        // Check if has alive workers and exit.
        function checkIfNoWorkersAndExit() {
            if (!workersCount) {
                log('Cluster graceful shutdown: done.');
                process.exit(0);
            } else {
                log('Cluster graceful shutdown: wait ' + workersCount + ' worker' + (workersCount > 1 ? 's' : '') + '.');
            }
        }

        function startShutdown() {

            if (disableGraceful) {
                process.exit(0);
                return;
            }

            // Shutdown timeout.
            setTimeout(function() {
                log('Cluster graceful shutdown: timeout, force exit.');
                process.exit(0);
            }, shutdownTimeout);

            // Shutdown mode.
            sigkill = true;

            // Log how many workers alive.
            checkIfNoWorkersAndExit();

            for (var id in cluster.workers) {
                // Send SIGTERM signal to all workers. SIGTERM starts graceful shutdown of worker inside it.
                process.kill(cluster.workers[id].process.pid);
            }
        }
        process.on('SIGTERM',startShutdown);
        process.on('SIGINT',startShutdown);

        // Gracefuly restart with 'kill -s SIGUSR2 <pid>'.
        process.on('SIGUSR2',function() {
            for (var id in cluster.workers) {
                // Push all workers to restart queue.
                restartQueue.push(cluster.workers[id].process.pid);
            }
            checkRestartQueue();
        });

        cluster.on('fork', function(worker) {
            workersCount++;
            worker.on('listening', function() {
                listeningWorkersCount++;
                // New worker online, maybe all online, try restart other.
                checkRestartQueue();
            });
            log('Cluster: worker ' + worker.process.pid + ' started.');
        });

        cluster.on('exit', function(worker, code, signal) {
            workersCount--;
            listeningWorkersCount--;
            if (sigkill) {
                checkIfNoWorkersAndExit();
                return;
            }
            log('Cluster: worker ' + worker.process.pid + ' died (code: ' + code + '), restarting...');
            fork();
        });

        process.on('uncaughtException', function(err) {
            if (disableGraceful) {
                log('Cluster error:', err.stack);
            } else {
                log('Cluster error:', err.message);
            }
        });

    } else {

        // Start worker.
        serverFunction();

        // Self restart logic.

        if (options.restartOnMemory) {
            setInterval(function() {
                var mem = process.memoryUsage().rss;
                if (mem > options.restartOnMemory) {
                    log('Cluster: worker ' + process.pid + ' used too much memory (' + Math.round(mem / (1024*1024)) + ' MB), restarting...');
                    GracefulCluster.gracefullyRestartCurrentWorker();
                }

            }, 1000);
        }

        if (options.restartOnTimeout) {

            setInterval(function() {

                log('Cluster: worker ' + process.pid + ' restarting by timer...');
                GracefulCluster.gracefullyRestartCurrentWorker();

            }, options.restartOnTimeout);
        }
    }
};

GracefulCluster.gracefullyRestartCurrentWorker = function() {
    // Perform restart by cluster to prevent all workers offline.
    process.send({
        cmd: 'restart',
        pid: process.pid
    });
};
var cluster = require('cluster');
var sysUtils = require('./utils');
var numCPUs = require('os').cpus().length;

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
            sysUtils.log('Cluster graceful shutdown: done.');
            process.exit(0);
        } else {
            sysUtils.log('Cluster graceful shutdown: wait ' + workersCount + ' worker' + (workersCount > 1 ? 's' : '') + '.');
        }
    }

    function startShutdown() {

        if (CONFIG.DEBUG) {
            process.exit(0);
            return;
        }

        // Shutdown timeout.
        setTimeout(function() {
            sysUtils.log('Cluster graceful shutdown: timeout, force exit.');
            process.exit(0);
        }, CONFIG.SHUTDOWN_TIMEOUT);

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
        sysUtils.log('Cluster: worker ' + worker.process.pid + ' started');
    });

    cluster.on('exit', function(worker, code, signal) {
        workersCount--;
        listeningWorkersCount--;
        if (sigkill) {
            checkIfNoWorkersAndExit();
            return;
        }
        sysUtils.log('Cluster: worker ' + worker.process.pid + ' died (code: ' + code + '), restarting...');
        fork();
    });

    process.on('uncaughtException', function(err) {
        if (CONFIG.DEBUG) {
            sysUtils.log('Cluster error:', err.stack);
        } else {
            sysUtils.log('Cluster error:', err.message);
        }
    });

} else {

    // Start worker.
    require('./server');

    // Self restart logic.

    // Perform restart by cluster to prevent all workers offline.
    function restart() {
        process.send({
            cmd: 'restart',
            pid: process.pid
        });
    }

    if (CONFIG.CLUSTER_MAX_CPU_LOAD_TIME_IN_SECONDS && CONFIG.CLUSTER_MAX_CPU_LOAD_IN_PERCENT) {

        var usage = require('usage');
        var stats = [];
        setInterval(function() {
            usage.lookup(process.pid, function(error, result) {

                if (error) {
                    console.error('Error getting process stats', err);
                    return;
                }

                stats.push(result.cpu);

                if (stats.length > CONFIG.CLUSTER_MAX_CPU_LOAD_TIME_IN_SECONDS) {
                    stats.shift();

                    var sum = 0;
                    stats.forEach(function(cpu) {
                        sum += cpu;
                    });
                    var averageCpu = sum / stats.length;

                    if (averageCpu > CONFIG.CLUSTER_MAX_CPU_LOAD_IN_PERCENT) {
                        sysUtils.log('Cluster: worker ' + process.pid + ' used too much CPU (' + averageCpu + '%), exiting...');
                        restart();
                    }
                }
            });
        }, 1000);
    }

    if (CONFIG.CLUSTER_WORKER_RESTART_ON_MEMORY_USED) {
        setInterval(function() {

            var mem = process.memoryUsage().rss;
            if (mem > CONFIG.CLUSTER_WORKER_RESTART_ON_MEMORY_USED) {
                sysUtils.log('Cluster: worker ' + process.pid + ' used too much memory (' + Math.round(mem / (1024*1024)) + ' MB), exiting...');
                restart();
            }

        }, 1000);
    }

    if (CONFIG.CLUSTER_WORKER_RESTART_ON_PERIOD) {

        setInterval(function() {

            sysUtils.log('Cluster: worker ' + process.pid + ' restarting by timer...');
            restart();

        }, CONFIG.CLUSTER_WORKER_RESTART_ON_PERIOD);
    }
}
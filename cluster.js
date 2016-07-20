var cluster = require('cluster');
var sysUtils = require('./utils');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

    var sigkill = false;
    var workersCount = 0;

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    function checkIfNoWorkersAndExit() {
        if (!workersCount) {
            sysUtils.log('Cluster graceful shutdown: done.');
            process.exit(0);
        } else {
            sysUtils.log('Cluster graceful shutdown: wait ' + workersCount + ' worker' + (workersCount > 1 ? 's' : '') + '.');
        }
    }

    function startShutdown() {
        sigkill = true;
        checkIfNoWorkersAndExit();
    }

    cluster.on('fork', function(worker) {
        sysUtils.log('Cluster: worker ' + worker.process.pid + ' started');
        workersCount++;
    });
    cluster.on('exit', function(worker, code, signal) {
        workersCount--;
        if (sigkill) {
            checkIfNoWorkersAndExit();
            return;
        }
        sysUtils.log('Cluster: worker ' + worker.process.pid + ' died (code: ' + code + '), restarting...');
        cluster.fork();
    });

    process.on('SIGTERM',startShutdown);
    process.on('SIGINT',startShutdown);

} else {

    require('./server');


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
                        process.kill(process.pid);
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
                process.kill(process.pid);
            }

        }, 1000);
    }

    if (CONFIG.CLUSTER_WORKER_RESTART_ON_PERIOD) {

        setInterval(function() {

            sysUtils.log('Cluster: worker ' + process.pid + ' restarting by timer...');
            process.kill(process.pid);

        }, CONFIG.CLUSTER_WORKER_RESTART_ON_PERIOD);
    }
}
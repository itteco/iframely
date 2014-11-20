var cluster = require('cluster');
var sysUtils = require('./utils');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('fork', function(worker) {
        sysUtils.log('Cluster: worker ' + worker.process.pid + ' started');
    });
    cluster.on('exit', function(worker, code, signal) {
        sysUtils.log('Cluster: worker ' + worker.process.pid + ' died (code: ' + code + '), restarting...');
        cluster.fork();
    });

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
                        process.exit(1);
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
                process.exit(1);
            }

        }, 1000);
    }
}
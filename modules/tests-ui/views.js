(function() {

    if (!CONFIG.tests) {
        module.exports = function(){};
        return;
    }

    var async = require('async');
    var moment = require('moment');
    var _ = require('underscore');
    var exec = require('child_process').exec;

    var models = require('./models');
    var utils = require('./utils');

    var PluginTest = models.PluginTest;
    var TestingProgress = models.TestingProgress;

    module.exports = function(app){

        app.get('/tests/run/:plugin', function(req, res, next) {

            if (req.params.plugin == "all") {
                PluginTest.update({}, {
                    $set: {
                        last_test_started_at: null
                    }
                }, {
                    upsert: false,
                    multi: true
                }, function(error) {
                    if (error) {
                        console.error('Error restarting all tests', error);
                    }
                });
                return res.redirect('/tests');
            }

            exec('sh ./test-plugins.sh ' + req.params.plugin, function (error, stdout, stderr) {
                console.log(stdout);
                res.redirect('/tests#' + req.params.plugin);
            });
        });

        app.get('/tests', function(req, res, next){

            if (!PluginTest) {
                return next(new Error("mongodb not initialized to store db logs"));
            }

            var progress, groups = [];

            async.waterfall([

                function loadProgress(cb) {
                    TestingProgress.findById(1, cb);
                },

                function loadPluginTests(_progress, cb) {

                    progress = _progress;

                    utils.loadPluginTests(cb);
                }

            ], function(error, pluginTests) {

                if (error) {
                    return next(new Error(error));
                }

                var stats = {
                    http1: 0,
                    h2: 0
                }

                var totalTime = Object.assign({}, stats),
                    totalCount = Object.assign({}, stats),
                    totalOkTime = Object.assign({}, stats),
                    totalOkCount = Object.assign({}, stats),
                    averageTime = Object.assign({}, stats),
                    averageOkTime = Object.assign({}, stats);

                pluginTests.forEach(function(pluginTest) {

                    if (!pluginTest.last_page_logs_dict) {
                        return;
                    }

                    for(var id in pluginTest.last_page_logs_dict) {
                        var log = pluginTest.last_page_logs_dict[id];
                        var key = log.h2 ? 'h2' : 'http1';
                        totalTime[key] += log.response_time;
                        totalCount[key]++;
                        if (!log.hasTimeout()) {
                            totalOkTime[key] += log.response_time;
                            totalOkCount[key]++;
                        }
                    }

                    var testedUrls = _.keys(pluginTest.last_page_logs_dict);

                    var logs = _.values(pluginTest.last_page_logs_dict);

                    var allTimeout = _.all(logs, function(log) {
                        return log.hasTimeout();
                    });
                    if (allTimeout) {
                        pluginTest.passedUrls = 0;
                    } else {
                        pluginTest.passedUrls = logs.filter(function(log) {
                            return !log.hasError();
                        }).length;
                    }

                    pluginTest.failedUrls = logs.length - pluginTest.passedUrls;
                    pluginTest.pendingUrls = _.difference(pluginTest.last_urls_set.urls, testedUrls).length;
                    pluginTest.hasError = pluginTest.failedUrls > 0;
                    // TODO: do something with this?
                    pluginTest.hasGeneralError = pluginTest.error || pluginTest.last_urls_set.hasError();
                });

                var good = {
                    title: 'Passed',
                    class: 'success'
                };
                var bad = {
                    title: 'Failed',
                    class: 'important'
                };

                groups.push(bad);
                groups.push(good);

                good.items = pluginTests.filter(function(p) { return !p.hasError; });
                bad.items = pluginTests.filter(function(p) { return p.hasError; });

                _.keys(stats).forEach(function(key) {
                    averageTime[key] = Math.round(totalTime[key] / (totalCount[key] || 1));
                    averageOkTime[key] = Math.round(totalOkTime[key] / (totalOkCount[key] || 1));
                });

                res.render('tests-ui',{
                    groups: groups,
                    time: moment().format("DD-MM-YY HH:mm"),
                    progress: progress,
                    averageTime: averageTime,
                    totalCount: totalCount,
                    averageOkTime: averageOkTime,
                    totalOkCount: totalOkCount,
                    statsKeys: _.keys(stats),
                    format: function(d) {
                        if (!d) {
                            return "–";
                        }
                        return moment(d).format("DD-MM-YY HH:mm")
                    }
                });
            });
        });
    }
})();

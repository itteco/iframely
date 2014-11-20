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

    var PluginTest = models.PluginTest;
    var PageTestLog = models.PageTestLog;
    var TestUrlsSet = models.TestUrlsSet;
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

            var progress, pluginTests, groups = [];

            async.waterfall([

                function loadProgress(cb) {
                    TestingProgress.findById(1, cb);
                },

                function loadPluginTests(_progress, cb) {

                    progress = _progress;

                    PluginTest.find({
                        obsolete: false
                    }, {}, {
                        sort:{
                            _id: 1
                        }
                    }, cb);
                },

                function loadTestSets(_pluginTests, cb) {

                    pluginTests = _pluginTests;

                    async.mapSeries(pluginTests, function(p, cb) {
                        TestUrlsSet.findOne({
                            plugin: p._id
                        }, {}, {
                            sort: {
                                created_at: -1
                            }
                        }, cb);
                    }, cb);
                },


                function loadLogs(sets, cb) {

                    var pluginTestsDict = _.object(pluginTests.map(function(p) { return [p._id, p]; }));

                    async.eachSeries(sets.filter(function(s) {return s;}), function(s, cb) {

                        var pluginTest = pluginTestsDict[s.plugin];
                        pluginTest.last_urls_set = s;
                        pluginTest.last_page_logs_dict = {};

                        s.urls = s.urls || [];

                        async.eachSeries(s.urls, function(url, cb) {

                            async.waterfall([

                                function(cb) {
                                    PageTestLog.findOne({
                                        url: url,
                                        plugin: s.plugin
                                    }, {}, {
                                        sort: {
                                            created_at: -1
                                        }
                                    }, cb);
                                },

                                function(log, cb) {

                                    if (log) {
                                        pluginTest.last_page_logs_dict[log.url] = log;
                                    }

                                    cb();
                                }

                            ], cb);

                        }, cb);

                    }, cb);
                }
            ], function(error) {

                if (error) {
                    return next(new Error(error));
                }

                var totalTime = 0,
                    totalCount = 0,
                    totalOkTime = 0,
                    totalOkCount = 0;

                pluginTests.forEach(function(pluginTest) {

                    if (!pluginTest.last_page_logs_dict) {
                        return;
                    }

                    for(var id in pluginTest.last_page_logs_dict) {
                        var log = pluginTest.last_page_logs_dict[id];
                        totalTime += log.response_time;
                        totalCount++;
                        if (!log.hasTimeout()) {
                            totalOkTime += log.response_time;
                            totalOkCount++;
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

                var averageTime = Math.round(totalTime / (totalCount || 1));
                var averageOkTime = Math.round(totalOkTime / (totalOkCount || 1));

                res.render('tests-ui',{
                    groups: groups,
                    time: moment().format("DD-MM-YY HH:mm"),
                    progress: progress,
                    averageTime: averageTime,
                    totalCount: totalCount,
                    averageOkTime: averageOkTime,
                    totalOkCount: totalOkCount,
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

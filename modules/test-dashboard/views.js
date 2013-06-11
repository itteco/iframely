(function() {

    var async = require('async');
    var moment = require('moment');
    var _ = require('underscore');

    var models = require('./models');

    var PluginTest = models.PluginTest;
    var PageTestLog = models.PageTestLog;
    var TestUrlsSet = models.TestUrlsSet;

    module.exports = function(app){

        app.get('/tests', function(req, res, next){

            if (!PluginTest) {
                return next(new Error("mongodb not initialized to store db logs"));
            }

            var pluginTests, groups = [];

            async.waterfall([

                function loadPluginTests(cb) {
                    PluginTest.find({
                        obsolete: false
                    }, {}, {}, cb);
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

                pluginTests.forEach(function(pluginTest) {

                    if (!pluginTest.last_page_logs_dict) {
                        return;
                    }

                    var testedUrls = _.keys(pluginTest.last_page_logs_dict);

                    var logs = _.values(pluginTest.last_page_logs_dict);

                    pluginTest.passedUrls = _.values(pluginTest.last_page_logs_dict).filter(function(log) {
                        return !log.hasError();
                    }).length;
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

                res.render('test-dashboard/index',{
                    groups: groups,
                    time: moment().format("DD-MM-YY HH:mm")
                });
            });
        });
    }
})();

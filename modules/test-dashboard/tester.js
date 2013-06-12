GLOBAL.CONFIG = require('../../config');

var async = require('async');
var _ = require('underscore');

var models = require('./models');

var iframely = require('../../lib/iframely');
var utils = require('./utils');

var testOnePlugin = false;

if (process.argv.length > 1) {
    testOnePlugin = process.argv[2];
}

process.on('uncaughtException', function(err) {
    console.log("uncaughtException", err.stack);
    process.abort();
});

var PluginTest = models.PluginTest;
var PageTestLog = models.PageTestLog;
var TestUrlsSet = models.TestUrlsSet;
var TestingProgress = models.TestingProgress;

if (!PluginTest) {
    console.error("Models not loaded. Tests will not run.");
    return;
}

function log() {
    if (CONFIG.DEBUG) {
        console.log.apply(console, arguments);
    }
}

function cerror() {
    if (CONFIG.DEBUG) {
        console.error.apply(console, arguments);
    }
}

function updateObsoletePluginTests(providersIds, cb) {
    PluginTest.update({
        _id: {
            $nin: providersIds
        },
        obsolete: false
    }, {$set: {obsolete: true}}, {multi: true}, cb);
}

function updateActualPluginTests(providersIds, cb) {
    PluginTest.update({
        _id: {
            $in: providersIds
        },
        obsolete: true
    }, {$set: {obsolete: false}}, {multi: true}, cb);
}

function createNewPluginTests(providersIds, cb) {

    async.waterfall([

        function findExistingProviders(cb) {
            PluginTest.find({
                _id: {
                    $in: providersIds
                }
            }).distinct('_id', cb);
        },

        function(ids, cb) {

            var newIds = _.difference(providersIds, ids);

            async.eachSeries(newIds, function(id, cb) {

                PluginTest.update({_id: id}, {
                    $set: {
                        obsolete: false
                    }
                }, {
                    upsert: true
                }, cb)

            }, cb);
        }

    ], cb);
}

function processPluginTests(pluginTest, plugin, count, cb) {

    var testUrlsSet, reachTestObjectFound = false;;

    log('===========================================');
    console.log('Testing provider:', plugin.id);

    function getFetchTestUrlsCallback(url, cb) {
        return function(error, urls) {
            if (error) {
                urls = {
                    error: error,
                    test: url
                };
            } else if (urls.length == 0) {
                urls = {
                    error: "No test urls found",
                    test: url
                };
            }
            cb(null, urls);
        }
    }

    async.waterfall([

        function markStart(cb) {
            pluginTest.last_test_started_at = new Date();
            pluginTest.save(cb);
        },

        function fixProgress(a, b, cb) {
            if (testOnePlugin) {
                cb(null, a);
            } else {

                TestingProgress.update({
                    _id: 1
                }, {
                    $set: {
                        tested_plugins_count: count,
                        last_plugin_test_started_at: new Date(),
                        current_testing_plugin: plugin.id
                    }
                }, {
                    upsert: false
                }, cb);
            }
        },

        function getUrls(a, cb) {

            var tests = plugin.module.tests;

            if (!tests) {

                cb(null, null);

            } else if (typeof tests === "string") {

                cb(null, [tests]);

            } else {

                async.map(tests.filter(function(x) {return x;}), function(url, cb) {

                    if (typeof url === "string") {
                        // Array of strings.
                        cb(null, url);
                    } else if (url) {

                        reachTestObjectFound = true;

                        if (url.feed) {
                            // Fetch feed.
                            utils.fetchFeedUrls(url.feed, getFetchTestUrlsCallback(url, cb));

                        } else if (url.pageWithFeed) {
                            // Find feed on page and fetch feed.
                            utils.fetchUrlsByPageOnFeed(url.pageWithFeed, getFetchTestUrlsCallback(url, cb));

                        } else if (url.page && url.selector) {
                            // Find urls on page by jqeury selector.
                            utils.fetchUrlsByPageAndSelector(url.page, url.selector, getFetchTestUrlsCallback(url, cb));

                        } else if (url.noFeeds || url.skipMethods || url.skipMixins) {

                            cb(null, null);

                        } else {
                            cb(null, {
                                error: "Not supported test object",
                                test: url
                            });
                        }

                    } else {
                        cb(null, null);
                    }
                }, cb);
            }
        },

        function(urls, cb) {

            urls = urls || [];

            urls = _.flatten(urls);

            var errors = urls.filter(function(url) {
                return url && url.error;
            });

            urls = urls.filter(function(url) {
                return typeof url === "string";
            });

            if (urls.length == 0) {
                errors.push("No test urls specified");
            } else if (!reachTestObjectFound) {
                errors.push("No test feeds specified");
            }

            // TODO: add additional_test_urls.

            testUrlsSet = new TestUrlsSet({
                plugin: pluginTest._id,
                urls: urls
            });
            testUrlsSet.errors = errors.length ? errors : undefined
            testUrlsSet.save(cb);
        },

        function(testUrlsSet, count, cb) {

            async.eachSeries(testUrlsSet.urls, function(url, cb) {

                log('   Testing url:', url);

                var startTime = new Date().getTime();
                var timeout;

                // TODO: handle schema validation errors.

                function callback(error, data) {

                    if (!timeout) {
                        // TODO: log response error after timeout?
                        return;
                    }

                    clearInterval(timeout);
                    timeout = null;

                    // TODO: add logic errors. Maybe in models.

                    if (error) {
                        log('       error!', error);
                    } else {
                        log('       done');
                    }

                    var logEntry = new PageTestLog({
                        url: url,
                        test_set: testUrlsSet._id,
                        plugin: plugin.id,
                        response_time: new Date().getTime() - startTime
                    });

                    if (error) {
                        logEntry.errors = [JSON.stringify(error)];
                    }

                    if (data) {

                        // Method errors.
                        var errors = utils.getErrors(data);
                        if (errors) {
                            logEntry.errors = logEntry.errors || [];
                            errors.forEach(function(m) {
                                log("       " + m);
                                logEntry.errors.push(m);
                            });
                        }

                        // Search unused methods.
                        var unusedMethods = utils.getPluginUnusedMethods(plugin.id, data);
                        // Error on mandatory methods.
                        if (unusedMethods.mandatory.length > 0) {
                            logEntry.errors = logEntry.errors || [];
                            unusedMethods.mandatory.forEach(function(m) {
                                if (errors && errors.indexOf(m) > -1) {
                                    // Skip no data if error.
                                    return;
                                }
                                log("       " + m + ": no data");
                                logEntry.errors.push(m + ": no data");
                            });
                        }
                        // Warning on non-mandatory methods.
                        if (unusedMethods.skipped.length > 0) {
                            logEntry.warnings = logEntry.warnings || [];
                            unusedMethods.skipped.forEach(function(m) {
                                if (errors && errors.indexOf(m) > -1) {
                                    // Skip no data if error.
                                    return;
                                }
                                logEntry.warnings.push(m + ": no data");
                            });
                        }
                    }

                    logEntry.save(cb);
                }

                timeout = setTimeout(function() {
                    callback('timeout');
                }, CONFIG.tests.single_test_timeout);

                iframely.getRawLinks(url, {
                    debug: true,
                    disableCache: true
                }, callback);

            }, cb);
        },

        function removeOldSets(cb) {
            TestUrlsSet.remove({
                _id: {
                    $ne: testUrlsSet._id
                },
                plugin: plugin.id
            }, cb);
        }

    ], cb);
};

function testAll(cb) {

    var plugins = iframely.getPlugins();

    // Get all plugins with tests.
    var pluginsList = _.values(plugins).filter(function(plugin) {

        if (plugin.module.tests && plugin.module.tests.noTest) {
            return false;
        }

        return plugin.domain || plugin.tests;
    });
    var pluginsIds = pluginsList.map(function(plugin) {
        return plugin.id;
    });

    console.log('Start tests with', pluginsList.length, 'plugins to test.');

    var count = 0;

    async.waterfall([

        function initPluginTests(cb) {
            async.parallel([
                function(cb) {
                    updateObsoletePluginTests(pluginsIds, cb);
                },
                function(cb) {
                    updateActualPluginTests(pluginsIds, cb);
                },
                function(cb) {
                    createNewPluginTests(pluginsIds, cb);
                }
            ], cb);
        },

        function loadPluginTests(data, cb) {

            if (testOnePlugin) {
                PluginTest.find({_id: testOnePlugin}, cb);
            } else {

                async.waterfall([

                    function loadPluginTests(cb) {
                        PluginTest.find({
                            obsolete: false
                        }, {}, {}, cb);
                    },

                    function filterAndSort(pluginTests, cb) {

                        pluginTests.forEach(function(pluginTest) {
                            var modified = plugins[pluginTest._id].modified;
                            if (pluginTest.last_test_started_at && pluginTest.last_test_started_at < modified) {
                                pluginTest.last_test_started_at = null;
                            }
                        });

                        var filterDate = new Date(new Date() - CONFIG.tests.plugin_test_period);

                        pluginTests = pluginTests.filter(function(pluginTest) {
                            return !pluginTest.last_test_started_at || pluginTest.last_test_started_at < filterDate;
                        });

                        pluginTests.sort(function(a, b) {

                            if (!a.last_test_started_at && !b.last_test_started_at) {
                                return 0;
                            }

                            if (!a.last_test_started_at) {
                                return -1;
                            }

                            if (!b.last_test_started_at) {
                                return 1;
                            }

                            return a.last_test_started_at - b.last_test_started_at;
                        });

                        cb(null, pluginTests);
                    }

                ], cb);
            }

        },

        function(pluginTests, cb) {

            if (testOnePlugin || pluginTests.length == 0) {
                cb(null, pluginTests)
            } else {
                TestingProgress.update({
                    _id: 1
                }, {
                    $set: {
                        total_plugins_count: pluginTests.length,
                        tested_plugins_count: 0,
                        tests_started_at: new Date()
                    },
                    $unset: {
                        tests_finished_at: 1,
                        last_plugin_test_started_at: 1,
                        current_testing_plugin: 1
                    }
                }, {
                    upsert: true
                }, function(error) {
                    cb(error, pluginTests);
                });
            }
        },

        function(pluginTests, cb) {

            log("Loaded PluginTest's from db", pluginTests.length);

            async.eachSeries(pluginTests, function(pluginTest, cb) {

                processPluginTests(pluginTest, plugins[pluginTest._id], count, function(error) {

                    count++;

                    if (error) {
                        cerror('    Plugin test error', pluginTest._id, error);
                        pluginTest.error = error;
                    } else {
                        pluginTest.error = undefined;
                    }
                    pluginTest.save(cb);
                });

            }, cb);
        },

        function(cb) {
            if (testOnePlugin || pluginTests.length == 0) {
                cb()
            } else {
                TestingProgress.update({
                    _id: 1
                }, {
                    $set: {
                        tested_plugins_count: count,
                        tests_finished_at: new Date()
                    },
                    $unset: {
                        last_plugin_test_started_at: 1,
                        current_testing_plugin: 1
                    }
                }, {
                    upsert: false
                }, cb);
            }
        }

    ], function(error) {
        if (error) {
            console.error('Global testing error:', error);
        } else {
            console.log('Testing finished');
        }
        cb();
    });
}

function startTest() {
    testAll(function() {

        if (testOnePlugin) {
            process.abort();
        }

        setTimeout(function() {
            // Script should be restarted on that period to check new files version.
            process.abort();
        }, CONFIG.tests.relaunch_script_period);
    });
}

startTest();
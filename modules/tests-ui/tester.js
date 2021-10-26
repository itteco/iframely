import config from '../../config.js';
global.CONFIG = config;

if (!CONFIG.tests) {
    console.error('Tests not started: CONFIG.tests not configured.');
    process.exit(0);
    // return;
}

process.title = "iframely-tests";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import * as async from 'async';
import * as _ from 'underscore';
import * as models from './models.js';
import * as utils from './utils.js';
import { run as iframely } from '../../lib/core.js';
import * as whitelist from '../../lib/whitelist.js';
import * as pluginLoader from '../../lib/loader/pluginLoader.js';
var plugins = pluginLoader._plugins;

var testOnePlugin = false;

if (process.argv.length > 1) {
    testOnePlugin = process.argv[2];
}

process.on('uncaughtException', function(err) {

    console.log("uncaughtException", err.stack);

    TestingProgress.update({
        _id: 1
    }, {
        $set: {
            tests_finished_at: new Date(),
            last_uncaught_exception: err.message
        }
    }, {
        upsert: false
    }, function(){
        process.abort();
    });
});

var PluginTest = models.PluginTest;
var PageTestLog = models.PageTestLog;
var TestUrlsSet = models.TestUrlsSet;
var TestingProgress = models.TestingProgress;

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

function checkPageTestLogChangeNotification(logEntry) {

    PageTestLog
        .find({
            url: logEntry.url,
            plugin: logEntry.plugin,    
            created_at: {
                $lt: logEntry.created_at
            }
        })
        .sort({created_at: -1})
        .limit(1)
        .exec(function(error, previousLogEntry) {

            previousLogEntry = previousLogEntry && previousLogEntry.length && previousLogEntry[0];

            /*

            Case 1.

            Was not error OR was no record.
            Become error.
            -- Notify error.

            Case 2.

            Was error.
            Become good.
            -- Notify fix.

            Case 3.

            Was error.
            Become error.
            -- Notify: still failing.

            */

            var wasError = previousLogEntry && previousLogEntry.hasError();
            var hasError = logEntry.hasError();

            if (!wasError && hasError) {

                // Case 1.
                // -- Notify error.

                utils.sendQANotification(logEntry, {
                    message: "Failed",
                    color: "red"
                });

            } else if (wasError && !hasError) {

                // Case 2.
                // -- Notify fix.

                utils.sendQANotification(logEntry, {
                    message: "Fixed",
                    color: "green"
                });

            } else if (wasError && hasError) {

                // Case 3.
                // -- Notify: still failing.

                utils.sendQANotification(logEntry, {
                    message: "Still failing",
                    color: "yellow"
                });
            }
        });
}

function processPluginTests(pluginTest, plugin, count, cb) {

    var testUrlsSet, reachTestObjectFound = false;;

    log('===========================================');
    console.log('Testing provider:', plugin.id);

    function getFetchTestUrlsCallback(testInfo, cb) {
        return function(error, urls) {
            if (error) {
                urls = {
                    error: error,
                    test: testInfo
                };
            } else if (urls.length == 0) {
                urls = {
                    error: "No test urls found",
                    test: testInfo
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

        function fixProgress(a, cb) {
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

            } else if (_.isArray(tests)) {

                async.map(tests.filter(function(x) {return x;}), function(url, cb) {

                    if (typeof url === "string") {
                        // Array of strings.
                        cb(null, url);
                    } else if (url) {

                        reachTestObjectFound = true;

                        if (url.feed) {
                            // Fetch feed.
                            utils.fetchFeedUrls(url.feed, {
                                getUrl: url.getUrl
                            }, getFetchTestUrlsCallback(url, cb));

                        } else if (url.pageWithFeed) {
                            // Find feed on page and fetch feed.
                            utils.fetchUrlsByPageOnFeed(url.pageWithFeed, {
                                getUrl: url.getUrl
                            }, getFetchTestUrlsCallback(url, cb));

                        } else if (url.page && url.selector) {
                            // Find urls on page by jqeury selector.
                            utils.fetchUrlsByPageAndSelector(url.page, url.selector, {
                                getUrl: url.getUrl,
                                urlAttribute: url.urlAttribute
                            }, getFetchTestUrlsCallback(url, cb));

                        } else if (url.getUrls) {

                            url.getUrls(getFetchTestUrlsCallback('getUrls', cb));

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

            } else {
                cb(null, null);
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
            testUrlsSet.errors_list = errors.length ? errors : undefined;
            testUrlsSet.save(cb);
        },

        function(testUrlsSet, cb) {

            var testMode = 'default'; //'http1-first', 'h2-first'

            var disableHttp2 = false;
            if (testMode === 'http1-first') {
                disableHttp2 = true;
            }

            function processTestUrl(url, cb) {
                log('   Testing url ' + (disableHttp2 ? 'http1 only' : '') + ':', url);

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

                    if (testMode === 'http1-first') {
                        if (!disableHttp2 && (!data || !data.h2)) {
                            // No http2.
                            // Next iteration.
                            disableHttp2 = true;
                            cb();
                            return;
                        }
                    }

                    var logEntry = new PageTestLog({
                        url: url,
                        test_set: testUrlsSet._id,
                        plugin: plugin.id,
                        response_time: new Date().getTime() - startTime
                    });

                    if (error) {
                        if (error.code === "timeout") {
                            logEntry.warnings = [error.code];
                        } else if (error.responseCode === 404 || error.responseCode === 410) {
                            logEntry.warnings = [error.responseCode];
                        } else if (error.responseCode === 403 && error.messages) {
                            logEntry.warnings = [error.responseCode].concat(error.messages);
                        } else if (error.stack) {
                            logEntry.errors_list = [error.stack];
                        } else {
                            logEntry.errors_list = [JSON.stringify(error)];
                        }
                    }

                    if (data) {

                        logEntry.h2 = data.h2;

                        var rels = [];
                        data.links.forEach(function(link) {
                            link.rel.forEach(function(rel) {
                                if (CONFIG.REL_GROUPS.indexOf(rel) > -1 && rels.indexOf(rel) == -1) {
                                    rels.push(rel);
                                }
                            });
                        });

                        logEntry.rel = rels;

                        // Search unused methods.
                        var unusedMethods = utils.getPluginUnusedMethods(plugin.id, data);
                        var allMandatoryMethods = unusedMethods.allMandatoryMethods;

                        // Method errors.
                        var errors = utils.getErrors(data);
                        if (errors) {
                            logEntry.errors_list = logEntry.errors || [];
                            errors.forEach(function(m) {
                                var inMandatory = _.find(allMandatoryMethods, function(mandatoryMethod) {
                                    return m.indexOf(mandatoryMethod) > -1;
                                });

                                if (inMandatory) {
                                    log("       " + m);
                                    logEntry.errors_list.push(m);
                                }
                            });
                        }

                        // Error on unused mandatory methods.
                        if (unusedMethods.mandatory.length > 0) {
                            logEntry.errors_list = logEntry.errors_list || [];
                            unusedMethods.mandatory.forEach(function(m) {
                                var inError = _.find(errors, function(error) {
                                    return error.indexOf(m) > -1;
                                });
                                if (inError) {
                                    // Skip no data if error.
                                    return;
                                }
                                log("       " + m + ": no data");
                                logEntry.errors_list.push(m + ": no data");
                            });
                        }
                        // Warning on unused non-mandatory methods.
                        if (unusedMethods.skipped.length > 0) {
                            logEntry.warnings = logEntry.warnings || [];
                            unusedMethods.skipped.forEach(function(m) {
                                var inError = _.find(errors, function(error) {
                                    return error.indexOf(m) > -1;
                                });
                                if (inError) {
                                    // Skip no data if error.
                                    return;
                                }
                                logEntry.warnings.push(m + ": no data");
                            });
                        }
                    }

                    logEntry.save(function(error) {

                        if (error) {
                            console.log('error', error)
                            return cb(error);
                        }

                        checkPageTestLogChangeNotification(logEntry);

                        if (testMode === 'http1-first') {

                            if (disableHttp2) {
                                disableHttp2 = false;
                                processTestUrl(url, cb);
                            } else {
                                disableHttp2 = true;
                                cb();
                            }

                        } else if (testMode === 'h2-first') {

                            if (logEntry.h2 && !disableHttp2) {
                                // http2 used. Now try without it.
                                disableHttp2 = true;
                                processTestUrl(url, cb);
                            } else {
                                // Reset disableHttp2 to make next test with http2.
                                disableHttp2 = false;
                                cb();
                            }

                        } else {
                            cb();
                        }
                        
                    });
                }

                timeout = setTimeout(function() {
                    callback('timeout');
                }, CONFIG.tests.single_test_timeout);

                setTimeout(function() {
                    iframely(url, {
                        v: '1.3',
                        debug: true,
                        refresh: true,
                        readability: true,
                        disableHttp2: disableHttp2,
                        getWhitelistRecord: whitelist.findWhitelistRecordFor
                    }, callback);
                }, CONFIG.tests.pause_between_tests || 0);
            }

            async.eachSeries(testUrlsSet.urls, processTestUrl, cb);
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

    // Get all plugins with tests.
    var pluginsList = _.values(plugins).filter(function(plugin) {

        if (plugin.module.tests && plugin.module.tests.noTest) {
            return false;
        }

        return plugin.domain || plugin.module.tests;
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
                            var modified = plugins[pluginTest._id].getPluginLastModifiedDate();
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
                        current_testing_plugin: 1,
                        last_uncaught_exception: 1
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
            if (testOnePlugin || count == 0) {
                cb();
            } else {
                console.log('finish');

                TestingProgress.update({
                    _id: 1
                }, {
                    $set: {
                        tested_plugins_count: count,
                        tests_finished_at: new Date()
                    },
                    $unset: {
                        last_plugin_test_started_at: 1,
                        current_testing_plugin: 1,
                        last_uncaught_exception: 1
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
            process.exit(0);
        }

        setTimeout(function() {
            // Script should be restarted on that period to check new files version.
            process.exit(0);
        }, CONFIG.tests.relaunch_script_period);
    });
}

startTest();
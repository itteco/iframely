GLOBAL.CONFIG = require('../../config');

var async = require('async');
var _ = require('underscore');

var models = require('./models');

var iframely = require('../../lib/iframely');
var utils = require('./utils');

var PluginTest = models.PluginTest;
var PageTestLog = models.PageTestLog;
var TestUrlsSet = models.TestUrlsSet;

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

function processPluginTests(pluginTest, plugin, cb) {

    var testUrlsSet;

    log('===========================================');
    log('Testing provider:', plugin.id);

    async.waterfall([

        function getUrls(cb) {

            var tests = plugin.module.tests;

            if (typeof tests === "string") {
                cb(null, [tests]);
            } else {

                async.map(tests, function(url, cb) {
                    if (typeof url === "string") {
                        // Array of strings.
                        return cb(null, url);
                    } else if (url) {

                        if (url.feed) {
                            // Fetch feed.
                            utils.fetchFeedUrls(url.feed, cb);
                        } else if (url.pageWithFeed) {
                            // Find feed on page and fetch feed.
                            utils.fetchUrlsByPageOnFeed(url.pageWithFeed, cb);
                        } else if (url.page && url.selector) {
                            utils.fetchUrlsByPageAndSelector(url.page, url.selector, cb);
                        }

                    } else {
                        return cb(null, null);
                    }
                }, cb);
            }
        },

        function(urls, cb) {

            urls = urls.filter(function(url) {
                return url;
            });

            urls = _.flatten(urls);

            if (urls.length == 0) {
                return cb('No test urls');
            }

            // TODO: add additional_test_urls.

            testUrlsSet = new TestUrlsSet({
                plugin: pluginTest._id,
                urls: urls
            });
            testUrlsSet.save(cb);
        },

        function(testUrlsSet, count, cb) {

            async.eachSeries(testUrlsSet.urls, function(url, cb) {

                log('   Testing url:', url);

                var startTime = new Date().getTime();
                var timeout, timeoutTime = 10;

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
                        if (unusedMethods.length > 0) {
                            logEntry.errors = logEntry.errors || [];
                            unusedMethods.forEach(function(m) {

                                if (errors && errors.indexOf(m) > -1) {
                                    // Skip no data if error.
                                    return;
                                }

                                log("       " + m + ": no data");
                                logEntry.errors.push(m + ": no data");
                            });
                        }
                    }


                    logEntry.save(cb);
                }

                timeout = setTimeout(function() {
                    callback('timeout: ' + timeoutTime + ' sec');
                }, timeoutTime * 1000);

                iframely.getRawLinks(url, {
                    debug: true,
                    disableCache: true
                }, callback);

            }, cb);
        }

    ], cb);
};

function testAll(cb) {

    var plugins = iframely.getPlugins();

    // Get all plugins with tests.
    var pluginsList = _.values(plugins).filter(function(plugin) {
        if (plugin.domain && !plugin.module.tests) {
            console.warn('Domain plugin without tests:', plugin.id);
        }

        if (process.argv.length > 2) {
            if (process.argv[2] != plugin.id) {
                // node tester.js
                return false;
            }
        }

        return !!plugin.module.tests;
    });
    var pluginsIds = pluginsList.map(function(plugin) {
        return plugin.id;
    });

    log('Start tests with', pluginsList.length, 'plugins to test.');

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
            PluginTest.find({
                _id: {
                    $in: pluginsIds
                },
                obsolete: false
            }, {}, {}, cb);
        },

        function(pluginTests, cb) {

            log("Loaded PluginTest's from db", pluginTests.length);

            // TODO: change pluginTests ordering method - first untested OR last changed untested.

            async.eachSeries(pluginTests, function(pluginTest, cb) {

                processPluginTests(pluginTest, plugins[pluginTest._id], function(error) {

                    if (error) {
                        // TODO: log provider error to DB.
                        cerror('    Plugin test error', pluginTest._id, error);
                    }

                    cb();
                });

            }, cb);
        }
    ], function(error) {
        cerror('Global testing error:', error);
        cb();
    });
}

function startTest() {
    testAll(function() {
        setTimeout(startTest, 5 * 60 * 60 * 1000); // each 5 hours.
    });
}

startTest();
import * as _ from 'underscore';
import FeedParser from 'feedparser';
import request from 'request';
import * as async from 'async';
import * as url from 'url';
import { PageTestLog, TestUrlsSet, PluginTest } from './models.js';
import { findWhitelistRecordFor } from '../../lib/whitelist.js';
import { getPluginData as iframelyGetPluginData } from '../../lib/core.js';
import * as pluginLoader from '../../lib/loader/pluginLoader.js';
import * as pluginUtils from '../../lib/loader/utils.js';

var plugins = pluginLoader._plugins,
    pluginsList = pluginLoader._pluginsList,
    DEFAULT_PARAMS = [].concat(pluginUtils.DEFAULT_PARAMS, pluginUtils.POST_PLUGIN_DEFAULT_PARAMS),
    PLUGIN_METHODS = pluginUtils.PLUGIN_METHODS;

var globalSkipMixins = [];

pluginsList.forEach(function(p) {
    var tests = p.module.tests;
    if (tests && tests.skipTestAsMixin) {
        globalSkipMixins.push(p.id);
    }
});

const COLORS = {
    green:  "#008000",
    red:    "#FF0000",
    yellow: "#FFFF00"
};

const SLACK_USERNAME = "Testy";

export function sendQANotification(logEntry, data) {

    if (CONFIG.SLACK_WEBHOOK_FOR_QA && CONFIG.SLACK_CHANNEL_FOR_QA) {

        var baseAppUrl = CONFIG.baseAppUrl;
        if (/^\/\//.test(baseAppUrl)) {
            baseAppUrl = 'https:' + baseAppUrl;
        }

        var previewMessage = "[" + logEntry.plugin + "] " + data.message;
        var message = "<" + baseAppUrl + "/tests#" + encodeURIComponent(logEntry.plugin) + "|[" + logEntry.plugin + "]> " + data.message;

        var errors = logEntry.errors_list.map(function(info) {
            return info.replace(logEntry.plugin + ' - ', '');
        }).join(" - ");
        if (errors) {
            message += " - " + errors;
        }

        request({
            uri: CONFIG.SLACK_WEBHOOK_FOR_QA,
            method: 'POST',
            json: true,
            body: {
                "parse": "none",
                "channel": CONFIG.SLACK_CHANNEL_FOR_QA,
                "username": SLACK_USERNAME,
                "text": previewMessage,
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": message  // Message: [domain.com] Failed - errors.
                        }
                    }
                ],
                "attachments": [
                    {
                        "blocks": [{
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "verbatim": true,
                                "text": "`<" + (CONFIG.QA_BASE_URL || baseAppUrl) + "/debug?uri=" + encodeURIComponent(logEntry.url) + "|debug>` " + logEntry.url.replace(/^https?:\/\//, '')    // Debug link.
                            }
                        }],
                        "color": COLORS[data.color]
                    }
                ]
            }
        });
    }
}

function getTestsSummary(cb) {
    loadPluginTests(function(error, pluginTests) {

        pluginTests.forEach(function(pluginTest) {

            if (!pluginTest.last_page_logs_dict) {
                return;
            }

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
            pluginTest.hasError = pluginTest.failedUrls > 0;
        });

        var good_items = pluginTests.filter(function(p) { return !p.hasError; });
        var bad_items = pluginTests.filter(function(p) { return p.hasError; });

        cb(null, {
            passed: good_items.length,
            failed: bad_items.length,
            failed_list: bad_items.map(function(p) {return p._id;})
        });
    });
}

export function loadPluginTests(cb) {

    var pluginTests;

    async.waterfall([

        function loadPluginTests(cb) {
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

                var testUrlSet;

                async.waterfall([

                    function(cb) {
                        TestUrlsSet.findOne({
                            plugin: p._id
                        }, {}, {
                            sort: {
                                created_at: -1
                            }
                        }, cb);
                    },

                    function(_testUrlSet, cb) {
                        testUrlSet = _testUrlSet;
                        if (testUrlSet) {
                            PageTestLog.find({
                                test_set: testUrlSet._id
                            }, cb)
                        } else {
                            cb(null, null);
                        }
                    },

                    function(pageTestLogs, cb) {
                        if (testUrlSet) {
                            testUrlSet.pageTestLogs = pageTestLogs || [];
                        }
                        cb(null, testUrlSet);
                    }
                ], cb);
                
            }, cb);
        },

        function loadLogs(sets, cb) {

            var pluginTestsDict = _.object(pluginTests.map(function(p) { return [p._id, p]; }));

            async.eachSeries(sets.filter(function(s) {return s;}), function(s, cb) {

                var pluginTest = pluginTestsDict[s.plugin];
                pluginTest.last_urls_set = s;
                pluginTest.last_page_logs_dict = {};

                s.urls = s.urls || [];
                s.pageTestLogs.forEach(function(pageTestLog) {
                    var key = pageTestLog.url;
                    if (pageTestLog.h2) {
                        key += ':h2';
                    }
                    pluginTest.last_page_logs_dict[key] = pageTestLog;
                });

                cb();

            }, cb);
        }
            
    ], function(error) {
        cb(error, pluginTests);
    });
}

export function getPluginUnusedMethods(pluginId, debugData) {

    var usedMethods = getAllUsedMethods(debugData);
    var pluginMethods = findAllPluginMethods(pluginId, plugins);

    return {
        allMandatoryMethods: pluginMethods.mandatory,
        mandatory: _.difference(pluginMethods.mandatory, usedMethods),
        skipped: _.difference(pluginMethods.skipped, usedMethods)
    };
};

export function getErrors(debugData) {

    var errors = [];

    debugData.allData.forEach(function(methodData) {
        if (methodData.error) {
            var methodId = methodData.method.pluginId + " - " + methodData.method.name;
            errors.push(methodId + ": " + methodData.error);
        }
    });

    if (errors.length) {
        return errors;
    } else {
        return null;
    }
};

var MAX_FEED_URLS = 5;

export function fetchFeedUrls(feedUrl, options, cb) {

    if (typeof options === "function") {
        cb = options;
        options = {};
    }

    var urls = [];

    var cbed = false;
    var _cb = function(error) {
        if (cbed) {
            return;
        }
        cbed = true;
        cb(error, urls);
    };

    request({
        uri: feedUrl,
        agentOptions: {
            rejectUnauthorized: false
        }
    })
        .pipe(new FeedParser({addmeta: false}))
        .on('error', function(error) {
            _cb(error);
        })
        .on('readable', function () {
            var stream = this, item;
            while (item = stream.read()) {

                if (urls.length < MAX_FEED_URLS) {

                    var url = item.origlink || item.link;

                    if (options.getUrl) {
                        url = options.getUrl(url);
                    }

                    if (!url) {
                        return;
                    }

                    urls.push(url);

                    if (MAX_FEED_URLS == urls.length) {
                        _cb();
                    }
                }
            }
        })
        .on('end', function() {
            _cb();
        });
};

export function fetchUrlsByPageOnFeed(pageWithFeed, otpions, cb) {

    if (typeof options === "function") {
        cb = options;
        options = {};
    }

    async.waterfall([

        function(cb) {
            iframelyGetPluginData(pageWithFeed, 'meta', findWhitelistRecordFor, cb);
        },

        function(meta, cb) {
            var alternate = meta.alternate;

            var feeds;

            if (alternate) {

                if (!(alternate instanceof Array)) {
                    alternate = [alternate];
                }

                feeds = alternate.filter(function(o) {
                    return o.href && (o.type == "application/atom+xml" || o.type == "application/rss+xml");
                });
            }

            if (feeds && feeds.length > 0) {

                cb(null, feeds[0].href, otpions);

            } else {
                cb("No feeds found on " + pageWithFeed);
            }
        },

        fetchFeedUrls

    ], cb);
};

export function fetchUrlsByPageAndSelector(page, selector, options, cb) {

    if (typeof options === "function") {
        cb = options;
        options = {};
    }

    async.waterfall([

        function(cb) {
            iframelyGetPluginData(page, 'cheerio', findWhitelistRecordFor, cb);
        },

        function(cheerio, cb) {

            var $links = cheerio(selector);

            var urls = [];
            $links.each(function() {
                if (urls.length < MAX_FEED_URLS) {
                    var href = cheerio(this).attr(options.urlAttribute || "href");
                    if (href) {
                        var href = url.resolve(page, href);
                        if (urls.indexOf(href) == -1) {

                            if (options.getUrl) {
                                href = options.getUrl(href);
                            }

                            if (!href) {
                                return;
                            }

                            urls.push(href);
                        }
                    }
                }
            });

            if (urls.length) {
                cb(null, urls);
            } else {
                cb("No urls found on " + page + " using selector='" + selector + "'");
            }
        }
    ], cb);
};

function getAllUsedMethods(debugData) {

    var result = [];

    // Collect all meta sources.
    for(var metaKey in debugData.meta._sources) {
        findUsedMethods({findByMeta: metaKey}, debugData, result);
    }

    // Collect all links sources
    debugData.links.forEach(function(link) {
        findUsedMethods({link: link}, debugData, result);
    });

    // Collect duplicate links.
    findUsedMethods({findSkippedDuplicates: true}, debugData, result);

    return result;
}

function findAllPluginMethods(pluginId, plugins, result, skipped) {

    result = result || {
        mandatory: [],
        skipped: []
    };

    var plugin = plugins[pluginId];

    var skipMixins = [];
    var skipMethods = [];
    var tests = plugin.module.tests;
    tests && tests.forEach && tests.forEach(function(test) {
        skipMixins = _.union(skipMixins, test.skipMixins, globalSkipMixins);
        if (test.skipMethods) {
            skipMethods = _.union(skipMethods, test.skipMethods);
        }
    });

    plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {

        if (!skipped && skipMixins.indexOf(mixin) == -1) {
            findAllPluginMethods(mixin, plugins, result);
        } else {
            findAllPluginMethods(mixin, plugins, result, true);
        }

    });

    PLUGIN_METHODS.forEach(function(method) {

        var methodId = pluginId + " - " + method;
        if (method in plugin.methods && result.mandatory.indexOf(methodId) == -1 && result.skipped.indexOf(methodId) == -1) {

            if (!skipped && skipMethods.indexOf(method) == -1) {
                result.mandatory.push(methodId);
            } else {
                result.skipped.push(methodId);
            }
        }
    });

    return result;
}

function findUsedMethods(options, debugData, result) {

    // Find debug data for specific link.

    result = result || [];

    debugData.allData.forEach(function(methodData) {

        if (!methodData.data) {
            return;
        }

        var resultData = methodData.data;
        if (!(resultData instanceof Array)) {
            resultData = [resultData];
        }

        resultData.forEach(function(l) {

            var good = false;
            if (options.link) {
                good = l.sourceId === options.link.sourceId;
            }

            if (options.findByMeta) {
                var pluginId = debugData.meta._sources[options.findByMeta];
                good = pluginId === methodData.method.pluginId
                        && methodData.method.name === 'getMeta'
                        && options.findByMeta in l;
            }

            if (options.findByData) {
                try {
                    good = _.intersection(_.keys(l), options.findByData).length > 0;
                } catch(ex) {
                    good = false;
                }
            }

            if (options.findSkippedDuplicates && l.error && l.error.indexOf && l.error.indexOf('duplication') > -1) {
                good = true
            }

            if (good) {

                var methodId = methodData.method.pluginId + " - " + methodData.method.name;

                var exists = result.indexOf(methodId) > -1;
                if (exists) {
                    return
                }

                result.push(methodId);

                var params = plugins[methodData.method.pluginId].methods[methodData.method.name];

                // Find parent data source.

                var findSourceForRequirements = _.difference(params, DEFAULT_PARAMS);

                if (findSourceForRequirements.length > 0) {
                    findUsedMethods({
                        findByData: findSourceForRequirements
                    }, debugData, result);
                }
            }
        });
    });

    return result;
}

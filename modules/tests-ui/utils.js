var _ = require('underscore');
var FeedParser = require('feedparser');
var request = require('request');
var async = require('async');
var url = require('url');

var findWhitelistRecordFor = require('../../lib/whitelist').findWhitelistRecordFor;

var iframelyGetPluginData = require('../../lib/core').getPluginData;

var pluginLoader = require('../../lib/loader/pluginLoader');
var pluginUtils = require('../../lib/loader/utils');
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

exports.getPluginUnusedMethods = function(pluginId, debugData) {

    var usedMethods = getAllUsedMethods(debugData);
    var pluginMethods = findAllPluginMethods(pluginId, plugins);

    return {
        allMandatoryMethods: pluginMethods.mandatory,
        mandatory: _.difference(pluginMethods.mandatory, usedMethods),
        skipped: _.difference(pluginMethods.skipped, usedMethods)
    };
};

exports.getErrors = function(debugData) {

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

var fetchFeedUrls = exports.fetchFeedUrls = function(feedUrl, options, cb) {

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

    request(feedUrl)
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

exports.fetchUrlsByPageOnFeed = function(pageWithFeed, otpions, cb) {

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

exports.fetchUrlsByPageAndSelector = function(page, selector, options, cb) {

    if (typeof options === "function") {
        cb = options;
        options = {};
    }

    async.waterfall([

        function(cb) {
            iframelyGetPluginData(page, 'cheerio', findWhitelistRecordFor, cb);
        },

        function($, cb) {

            var $links = $(selector);

            var urls = [];
            $links.each(function() {
                if (urls.length < MAX_FEED_URLS) {
                    var href = $(this).attr(options.urlAttribute || "href");
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

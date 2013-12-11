var iframely = require('../../lib/iframely');
var utils = require('../../utils');
var apiUtils = require('./utils');
var _ = require('underscore');
var moment = require('moment');
var jsonxml = require('jsontoxml');
var async = require('async');

function prepareUri(uri) {

    if (!uri) {
        return uri;
    }

    if (uri.match(/^\/\//i)) {
        return "http:" + uri;
    }

    if (!uri.match(/^https?:\/\//i)) {
        return "http://" + uri;
    }

    return uri;
}

function log() {
    var args = Array.prototype.slice.apply(arguments);
    args.splice(0, 0, "--", moment().utc().format("\\[YY-MM-DD HH:mm:ss\\]"));
    console.log.apply(console, args);
}

module.exports = function(app) {

    app.get('/iframely', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        log('Loading /iframely for', uri);

        async.waterfall([

            function(cb) {

                iframely.getRawLinks(uri, {
                    debug: req.query.debug,
                    mixAllWithDomainPlugin: req.query.mixAllWithDomainPlugin === "true",
                    forceMeta: req.query.meta === "true",
                    forceOembed: req.query.meta === "true",
                    disableCache: req.query.refresh === "true"
                }, cb);
            }

        ], function(error, result) {

            if (error) {

                res.tryCacheError(error);

                if (error == 404 || error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error("Requested page error: " + error));
            }

            var debug = result.debug;

            if (!req.query.debug) {
                // Debug used later. Do not dispose.
                delete result.debug;
                // Plugins are part of API. Do not dispose.
                delete result.plugins;
                delete result.time;
            }

            if (req.query.group) {
                var links = result.links;
                var groups = {};
                CONFIG.REL_GROUPS.forEach(function(rel) {
                    var l = links.filter(function(link) { return link.rel.indexOf(rel) > -1; });
                    if (l.length > 0) {
                        groups[rel] = l;
                    }
                });

                var other = links.filter(function(link) {
                    return _.intersection(link.rel, CONFIG.REL_GROUPS).length == 0
                });
                if (other.length) {
                    groups.other = other;
                }
                result.links = groups;
            }

            if (req.query.whitelist) {
                // if whitelist record's domain is "*" - ignore this wildcard
                var whitelistRecord = iframely.whitelist.findWhitelistRecordFor(uri) || {} ;
                result.whitelist = whitelistRecord.isDefault ? {} : whitelistRecord;
            }

            if (req.query.meta) {
                var raw_meta = result['raw-meta'] = {};
                if (debug.length > 0) {
                    raw_meta.meta = debug[0].context.meta;
                    raw_meta.oembed = debug[0].context.oembed;
                }
            }

            res.sendJsonCached(result);

            iframely.disposeObject(debug);
            iframely.disposeObject(result);

            if (global.gc) {
                //console.log('GC called');
                global.gc();
            }
        });
    });

    app.get('/meta-mappings', function(req, res, next) {

        var ms = iframely.metaMappings;

        res.sendJsonCached({
            attributes: _.keys(ms),
            sources: ms
        });
    });

    app.get('/reader.js', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        log('Loading /reader for', uri);

        async.waterfall([

            function(cb) {
                iframely.getRawReaderLink(uri, {
                    disableCache: req.query.refresh === "true"
                }, cb);
            }

        ], function(error, link) {

            if (error) {

                res.tryCacheError(error);

                if (error == 404 || error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error("Requested page error: " + error));
            }

            if (!link) {
                return next(new utils.NotFound());
            }

            var htmlArray = (link.html || "").match(/.{1,8191}/g) || "";

            var context = {
                embedCode: JSON.stringify(htmlArray),
                widgetId: JSON.stringify(1),
                uri: JSON.stringify(uri)
            };

            res.renderCached("readerjs.ejs", context, {
                "Content-Type": "text/javascript"
            });
        });

    });

    app.get('/render', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        log('Loading /render for', uri);

        async.waterfall([

            function(cb) {
                iframely.getRawRenderLink(uri, {
                    disableCache: req.query.refresh === "true"
                }, cb);
            }

        ], function(error, link) {

            if (error) {

                res.tryCacheError(error);

                if (error == 404 || error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
            }

            if (!link) {
                return next(new utils.NotFound());
            }

            res.renderCached(link._render.template, link.template_context);
        });

    });

    app.get('/supported-plugins-re.json', function(req, res, next) {

        var plugins = _.values(iframely.getPlugins());

        var regexps = [];

        var domainsDict = {};

        plugins.forEach(function(plugin) {

            if (plugin.domain) {

                if (plugin.re && plugin.re.length){
                    plugin.re.forEach(function(re){
                        regexps.push({
                            s: re.source,
                            m: ''+ (re.global?'g':'')+(re.ignoreCase?'i':'')+(re.multiline?'m':'')
                        });
                    });
                } else if (!(plugin.domain in domainsDict)) {

                    domainsDict[plugin.domain] = true;

                    regexps.push({
                        s: plugin.domain.replace(/\./g, "\\."),
                        m: ''
                    });
                }
            }
        });

        regexps.sort();

        res.sendJsonCached(regexps);
    });

    app.get('/oembed', function(req, res, next) {

        var uri = prepareUri(req.query.url);

        if (!uri) {
            return next(new Error("'url' get param expected"));
        }

        log('Loading /oembed for', uri);

        async.waterfall([

            function(cb) {

                iframely.getRawLinks(uri, cb);
            }

        ], function(error, result) {

            if (error) {

                res.tryCacheError(error);

                if (error == 404 || error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
            }

            var oembed = apiUtils.getOembed(uri, result);

            if (req.query.format === "xml") {

                var out = jsonxml({
                    oembed: oembed
                }, {
                    escape: true,
                    xmlHeader: {
                        standalone: true
                    }
                });

                res.sendCached('text/xml', out);

            } else {

                res.jsonpCached(oembed);
            }

            iframely.disposeObject(result);
        });
    });
};
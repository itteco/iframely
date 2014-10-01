var iframelyCore = require('../../lib/core');
var utils = require('../../utils');
var _ = require('underscore');
var async = require('async');
var cache = require('../../lib/cache');
var oembedUtils = require('../../lib/oembed');
var whitelist = require('../../lib/whitelist');
var pluginLoader = require('../../lib/loader/pluginLoader');
var jsonxml = require('jsontoxml');

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

var log = utils.log;

var version = require('../../package.json').version;

module.exports = function(app) {

    app.get('/iframely', function(req, res, next) {

        var uri = prepareUri(req.query.uri || req.query.url);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        if (!CONFIG.DEBUG && uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log('Loading /iframely for', uri);

        async.waterfall([

            function(cb) {

                iframelyCore.run(uri, {
                    debug: req.query.debug === "true",
                    mixAllWithDomainPlugin: req.query.mixAllWithDomainPlugin === "true",
                    forceParams: req.query.meta === "true" ? ["meta", "oembed"] : null,
                    whitelist: req.query.whitelist === 'true',
                    getWhitelistRecord: whitelist.findWhitelistRecordFor,
                    filterNonSSL: req.query.ssl === 'true' || req.query.ssl === '1',
                    filterNonHTML5: req.query.html5 === 'true' || req.query.html5 === '1',
                    filterAutoplay: req.query.autoplay === 'true' || req.query.autoplay === '1',
                    maxwidth: (req.query.maxwidth || req.query['max-width']) && parseInt(req.query.maxwidth || req.query['max-width'])
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

            if (result.safe_html) {
                cache.set('html:' + version + ':' + uri, result.safe_html);
                result.links.unshift({
                    href: CONFIG.baseAppUrl + "/reader.js?uri=" + encodeURIComponent(uri),
                    type: CONFIG.T.javascript,
                    rel: [CONFIG.R.reader, CONFIG.R.inline]
                });
                delete result.safe_html;
            }

            var render_link = _.find(result.links, function(link) {
                return link.html
                    && !link.href
                    && link.rel.indexOf(CONFIG.R.inline) === -1
                    && link.type === CONFIG.T.text_html;
            });
            if (render_link) {
                cache.set('render_link:' + version + ':' + uri, _.extend({
                    title: result.meta.title
                }, render_link)); // Copy to keep removed fields.
                render_link.href = CONFIG.baseAppUrl + "/render?uri=" + encodeURIComponent(uri);
                delete render_link.html;
            } else {
                // Cache non inline link to later render for older consumers.
                render_link = _.find(result.links, function(link) {
                    return link.html
                        && link.rel.indexOf(CONFIG.R.inline) > -1
                        && link.type === CONFIG.T.text_html;
                });
                if (render_link) {
                    cache.set('render_link:' + version + ':' + uri, _.extend({
                        title: result.meta.title
                    }, render_link)); // Copy to keep removed fields.
                }
            }

            iframelyCore.sortLinks(result.links);

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
/*
            if (req.query.whitelist) {
                // if whitelist record's domain is "*" - ignore this wildcard
                var whitelistRecord = iframely.whitelist.findWhitelistRecordFor(uri) || {} ;
                result.whitelist = whitelistRecord.isDefault ? {} : whitelistRecord;
            }
*/

            res.sendJsonCached(result);


            //iframely.disposeObject(debug);
            //iframely.disposeObject(result);

            if (global.gc) {
                //console.log('GC called');
                global.gc();
            }
        });
    });

    app.get('/reader.js', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        if (uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log('Loading /reader for', uri);

        async.waterfall([

            function(cb) {

                cache.withCache('html:' + version + ':' + uri, function(cb) {

                    iframelyCore.run(uri, {
                        getWhitelistRecord: whitelist.findWhitelistRecordFor
                    }, function(error, data) {

                        if (!data || !data.safe_html) {
                            error = 404;
                        }

                        cb(error, data && data.safe_html);
                    });

                }, cb);

            }

        ], function(error, html) {

            if (error) {

                res.tryCacheError(error);

                if (error == 404 || error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error("Requested page error: " + error));
            }

            var htmlArray = (html || "").match(/.{1,8191}/g) || "";

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

        if (uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log('Loading /render for', uri);

        async.waterfall([

            function(cb) {

                cache.withCache('render_link:' + version + ':' + uri, function(cb) {

                    iframelyCore.run(uri, {
                        getWhitelistRecord: whitelist.findWhitelistRecordFor
                    }, function(error, result) {

                        var render_link = result && _.find(result.links, function(link) {
                            return link.html
                                && link.rel.indexOf(CONFIG.R.inline) === -1
                                && link.type === CONFIG.T.text_html;
                        });

                        if (!render_link) {
                            // Cache non inline link to later render for older consumers.
                            render_link = _.find(result.links, function(link) {
                                return link.html
                                    && link.rel.indexOf(CONFIG.R.inline) > -1
                                    && link.type === CONFIG.T.text_html;
                            });
                        }

                        if (render_link) {
                            render_link.title = result.meta.title;
                        }

                        cb(error, render_link);
                    });

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

            res.renderCached('embed-html.ejs', {
                title: link.title,
                html: link.html
            });
        });

    });

    app.get('/supported-plugins-re.json', function(req, res, next) {

        var plugins = pluginLoader._plugins;

        var regexps = [];

        var domainsDict = {};

        for(var pluginId in plugins) {

            var plugin = plugins[pluginId];

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
        }

        regexps.sort();

        res.sendJsonCached(regexps);
    });

    app.get('/oembed', function(req, res, next) {

        var uri = prepareUri(req.query.url);

        if (!uri) {
            return next(new Error("'url' get param expected"));
        }

        if (uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log('Loading /oembed for', uri);

        async.waterfall([

            function(cb) {

                iframelyCore.run(uri, {
                    getWhitelistRecord: whitelist.findWhitelistRecordFor,
                    filterNonSSL: req.query.ssl === 'true',
                    filterNonHTML5: req.query.html5 === 'true',
                    filterAutoplay: req.query.noautoplay === 'true',
                    maxwidth: (req.query.maxwidth || req.query['max-width']) && parseInt(req.query.maxwidth || req.query['max-width'])
                }, cb);
            }

        ], function(error, result) {

            if (error) {

                res.tryCacheError(error);

                if (error == 404 || error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
            }

            var oembed = oembedUtils.getOembed(uri, result);

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

            //iframely.disposeObject(result);
        });
    });

};
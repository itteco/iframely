var iframely = require('../../lib/iframely');
var iframelyMeta = require('../../lib/iframely-meta');
var utils = require('../../utils');
var async = require('async');
var _ = require('underscore');

function prepareUri(uri) {

    if (uri.match(/^\/\//i)) {
        return "http:" + uri;
    }

    if (!uri.match(/^https?:\/\//i)) {
        return "http://" + uri;
    }

    return uri;
}

module.exports = function(app) {

    app.get('/iframely', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        console.log('-- Loading oembed2 for', uri);

        var meta;

        async.waterfall([

            function(cb) {

                if (req.query.meta) {
                    iframelyMeta.getPageData(uri, {
                        meta: true,
                        oembed: true,
                        fullResponse: false
                    }, cb);
                } else {
                    cb(null, null);
                }
            },

            function(data, cb) {
                meta = data;
                iframely.getRawLinks(uri, {
                    debug: req.query.debug,
                    mixAllWithDomainPlugin: req.query.mixAllWithDomainPlugin === "true",
                    disableCache: req.query.refresh === "true"
                }, cb);
            }

        ], function(error, result) {

            if (error) {
                if (error == 404 || error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
            }

            if (!req.query.debug) {
                delete result.debug;
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
                result.whitelist = iframely.whitelist.findWhitelistRecordFor(uri) || {};
            }

            if (meta) {
                result['raw-meta'] = meta;
            }

            res.send(result);
        });
    });

    app.get('/meta-mappings', function(req, res, next) {

        var ms = iframely.metaMappings;

        res.send({
            attributes: _.keys(ms),
            sources: ms
        });
    });

    app.get('/reader.js', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        console.log('-- Loading reader for', uri);

        async.waterfall([

            function(cb) {
                iframely.getRawReaderLink(uri, {
                    disableCache: req.query.disableCache === "true"
                }, cb);
            }

        ], function(error, link) {

            if (error) {
                if (error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
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

            res.setHeader("Content-Type", "text/javascript; charset=utf-8");
            res.render("article-insertable.js.ejs", context);
        });

    });

    app.get('/render', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        console.log('-- Loading render for', uri);

        async.waterfall([

            function(cb) {
                iframely.getRawRenderLink(uri, {
                    disableCache: req.query.disableCache === "true"
                }, cb);
            }

        ], function(error, link) {

            if (error) {
                if (error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
            }

            if (!link) {
                return next(new utils.NotFound());
            }

            res.render(link._render.template, link.template_context);
        });

    });

    // TODO: check who use that.
    app.get('/twitter', function(req, res, next) {

        var uri = prepareUri(req.query.uri);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        console.log('-- Loading twitter for', uri);

        iframelyMeta.getPageData(uri, {
            meta: true,
            oembed: false,
            fullResponse: false
        }, function(error, data) {

            if (error) {
                if (error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
            }

            res.send({
                twitter: data.meta.twitter || {}
            });
        });
    });

    app.get('/supported-plugins-re.json', function(req, res, next) {

        console.log('-- Loading supported-plugins-re.json');

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

        res.send(regexps);
    });
};
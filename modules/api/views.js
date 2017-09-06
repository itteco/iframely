var iframelyCore = require('../../lib/core');
var utils = require('../../utils');
var _ = require('underscore');
var async = require('async');
var cache = require('../../lib/cache');
var iframelyUtils = require('../../lib/utils');
var oembedUtils = require('../../lib/oembed');
var whitelist = require('../../lib/whitelist');
var pluginLoader = require('../../lib/loader/pluginLoader');
var jsonxml = require('jsontoxml');


function prepareUri(uri) {

    if (!uri) {
        return uri;
    }

    uri = uri.replace(/[\u200B-\u200D\uFEFF]/g, '');

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

function getBooleanParam(req, param) {
    var v = req.query[param];
    return v === 'true' || v === '1';
}

function getIntParam(req, param) {
    var v = req.query[param];
    return v && parseInt(v);
}

function handleIframelyError(error, res, next) {

    if (error == 404 || error.code == 'ENOTFOUND') {
        return next(new utils.NotFound('Page not found'));
    }

    var code = (typeof error !== "number" || error >= 500) ? 417 : error;
    next(new utils.HttpError(code, "Requested page error: " + error));
}

module.exports = function(app) {

    app.get('/iframely', function(req, res, next) {

        var uri = prepareUri(req.query.uri || req.query.url);

        if (!uri) {
            return next(new Error("'uri' get param expected"));
        }

        if (!CONFIG.DEBUG && uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log(req, 'Loading /iframely for', uri);

        async.waterfall([

            function(cb) {

                iframelyCore.run(uri, {
                    debug: getBooleanParam(req, 'debug'),
                    mixAllWithDomainPlugin: getBooleanParam(req, 'mixAllWithDomainPlugin'),
                    forceParams: req.query.meta === "true" ? ["meta", "oembed"] : null,
                    whitelist: getBooleanParam(req, 'whitelist'),
                    readability: getBooleanParam(req, 'readability'),
                    getWhitelistRecord: whitelist.findWhitelistRecordFor,
                    maxWidth: getIntParam(req, 'maxwidth') || getIntParam(req, 'max-width'),
                    promoUri: req.query.promoUri,
                    refresh: getBooleanParam(req, 'refresh')
                }, cb);
            }

        ], function(error, result) {


            if (error) {
                return handleIframelyError(error, res, next);
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

            if (!CONFIG.SKIP_IFRAMELY_RENDERS) {
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
            }

            iframelyCore.sortLinks(result.links);

            iframelyUtils.filterLinks(result, {
                filterNonSSL: getBooleanParam(req, 'ssl'),
                filterNonHTML5: getBooleanParam(req, 'html5'),
                maxWidth: getIntParam(req, 'maxwidth') || getIntParam(req, 'max-width')
            });

            var omit_css = getBooleanParam(req, 'omit_css');

            iframelyUtils.generateLinksHtml(result, {
                autoplayMode: getBooleanParam(req, 'autoplay'),
                aspectWrapperClass:     omit_css ? CONFIG.DEFAULT_OMIT_CSS_WRAPPER_CLASS : false,
                maxWidthWrapperClass:   omit_css ? CONFIG.DEFAULT_MAXWIDTH_WRAPPER_CLASS : false,
                omitInlineStyles: omit_css,
                forceWidthLimitContainer: true
            });

            var forceGroup = req.query.group ? getBooleanParam(req, 'group') : CONFIG.GROUP_LINKS;

            if (forceGroup) {
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

        if (!CONFIG.DEBUG && uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log(req, 'Loading /reader for', uri);

        async.waterfall([

            function(cb) {

                cache.withCache('html:' + version + ':' + uri, function(cb) {

                    iframelyCore.run(uri, {
                        getWhitelistRecord: whitelist.findWhitelistRecordFor,
                        readability: true
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
                return handleIframelyError(error, res, next);
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

        if (!CONFIG.DEBUG && uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log(req, 'Loading /render for', uri);

        async.waterfall([

            function(cb) {

                cache.withCache('render_link:' + version + ':' + uri, function(cb) {

                    iframelyCore.run(uri, {
                        getWhitelistRecord: whitelist.findWhitelistRecordFor
                    }, function(error, result) {

                        if (error) {
                            return cb(error);
                        }

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
                return handleIframelyError(error, res, next);
            }

            if (!link) {
                return next(new utils.NotFound('No render available'));
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

        if (!CONFIG.DEBUG && uri.split('/')[2].indexOf('.') === -1) {
            return next(new Error("local domains not supported"));
        }

        log(req, 'Loading /oembed for', uri);

        async.waterfall([

            function(cb) {

                iframelyCore.run(uri, {
                    getWhitelistRecord: whitelist.findWhitelistRecordFor,
                    filterNonSSL: getBooleanParam(req, 'ssl'),
                    filterNonHTML5: getBooleanParam(req, 'html5'),
                    maxWidth: getIntParam(req, 'maxwidth') || getIntParam(req, 'max-width'),
                    refresh: getBooleanParam(req, 'refresh')
                }, cb);
            }

        ], function(error, result) {

            if (error) {
                return handleIframelyError(error, res, next);
            }

            iframelyCore.sortLinks(result.links);

            iframelyUtils.filterLinks(result, {
                filterNonSSL: getBooleanParam(req, 'ssl'),
                filterNonHTML5: getBooleanParam(req, 'html5'),
                maxWidth: getIntParam(req, 'maxwidth') || getIntParam(req, 'max-width')
            });

            var oembed = oembedUtils.getOembed(uri, result, {
                mediaPriority: getBooleanParam(req, 'media'),
                omit_css: getBooleanParam(req, 'omit_css')
            });

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

    let processUrlOEmbed = (req,url,cb) => {
        var uri = prepareUri(url);
        if (!uri) {
            return cb({url:url,error:"empty url",error_code:"EMPTYURI"},null);
        }

        if (!CONFIG.DEBUG && uri.split('/')[2].indexOf('.') === -1) {
            return cb({url:url,error:"local domains not supported",error_code:"LOCALDOMAIN"},null);
        }

        log(req, 'Loading /oembed for', uri);

        async.waterfall([

            function(wcb) {

                iframelyCore.run(uri, {
                    getWhitelistRecord: whitelist.findWhitelistRecordFor,
                    filterNonSSL: getBooleanParam(req, 'ssl'),
                    filterNonHTML5: getBooleanParam(req, 'html5'),
                    maxWidth: getIntParam(req, 'maxwidth') || getIntParam(req, 'max-width'),
                    refresh: getBooleanParam(req, 'refresh')
                }, wcb);
            }

        ], function(error, result) {

            if (error) {
                return cb({url:url,error:error,error_code:error.code || error},null)
            }

            iframelyCore.sortLinks(result.links);

            iframelyUtils.filterLinks(result, {
                filterNonSSL: getBooleanParam(req, 'ssl'),
                filterNonHTML5: getBooleanParam(req, 'html5'),
                maxWidth: getIntParam(req, 'maxwidth') || getIntParam(req, 'max-width')
            });

            var oembed = oembedUtils.getOembed(uri, result, {
                mediaPriority: getBooleanParam(req, 'media'),
                omit_css: getBooleanParam(req, 'omit_css')
            });
            oembed.url = url
            cb(null,oembed)
      })
    }

    app.post('/oembed.bulk',function(req, res, next) {

        if (!req.body.urls || req.body.urls.length==0) {
              return next(new Error("'urls' post param expected"));
        }
        var urls = req.body.urls.slice(0,10)
        let curriedProcessUrlOEmbed = processUrlOEmbed.bind(undefined,req)
        async.map(urls,async.reflect(curriedProcessUrlOEmbed),function(err,result) {
          if (err) {
              return handleIframelyError(error, res, next);
          }
          let [errors,results] = _.partition(result,(r) => r.error)
          let errorUrls = _.pluck(errors,'error')
          let resultUrls = _.pluck(results,'value')
          let response = errorUrls.concat(resultUrls)
          res.jsonpCached(response);
        });

    });

};

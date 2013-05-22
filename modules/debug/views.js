var iframely = require('../../lib/iframely');
var utils = require('../../utils');
var async = require('async');
var _ = require('underscore');

module.exports = function(app) {

    app.get('/debug', function(req, res, next) {

        res.render('debug/index',{
            uri: req.query.uri
        });
    });

    app.get('/oembed2', function(req, res, next) {

        var start = new Date().getTime();

        async.waterfall([

            function(cb) {
                iframely.getRawLinks(req.query.uri, {debug: req.query.debug}, cb);
            }

        ], function(error, result) {

            if (!req.query.debug) {
                delete result.debug;
                delete result.plugins;
            } else {
                result.time = new Date().getTime() - start;
            }

            if (error) {
                if (error.code == 'ENOTFOUND') {
                    return next(new utils.NotFound('Page not found'));
                }
                return next(new Error(error));
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

            res.send(result);
        });
    });
};
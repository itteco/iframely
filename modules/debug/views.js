var iframely = require('../../lib/iframely');
var utils = require('../../utils');
var async = require('async');
var _ = require('underscore');

module.exports = function(app) {

    app.get('/debug', function(req, res, next) {

        var DEBUG = CONFIG.DEBUG;

        if ("debug" in req.query) {
            DEBUG = {"on":1, "true":1}[req.query.debug];
        }

        res.render('debug/index',{
            uri: req.query.uri,
            mixAllWithDomainPlugin: !!{"on":1, "true":1}[req.query.mixAllWithDomainPlugin],
            disableCache: !!{"on":1, "true":1}[req.query.refresh],
            DEBUG: DEBUG
        });
    });
};
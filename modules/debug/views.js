var iframely = require('../../lib/iframely');
var utils = require('../../utils');
var async = require('async');
var _ = require('underscore');

module.exports = function(app) {

    app.get('/debug', function(req, res, next) {

        res.render('debug/index',{
            uri: req.query.uri,
            mixAllWithDomainPlugin: !!{"on":1, "true":1}[req.query.mixAllWithDomainPlugin],
            disableCache: !!{"on":1, "true":1}[req.query.refresh],
            DEBUG: CONFIG.DEBUG
        });
    });
};
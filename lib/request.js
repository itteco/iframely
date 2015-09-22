var request = require('request');
var crypto = require('crypto');
var cache = require('./cache');

var hash = function(value) {
    return '"' + crypto.createHash('md5').update(value).digest("hex") + '"';
};

module.exports = function(options, callback) {

    var key = hash(JSON.stringify(options));

    cache.withCache(key, function(cb) {

        // TODO: how to prevent cache some non errored error responses.

        request(options, function(error, response, data) {
            cb(error, {
                response: {
                    statusCode: response && response.statusCode
                },
                data: data
            });
        });

    }, {}, function(error, data) {
        callback(error, data.response, data.data);
    });
};
var request = require('request');
var _ = require('underscore');
var crypto = require('crypto');
var cache = require('./cache');

var hash = function(value) {
    return '"' + crypto.createHash('md5').update(value).digest("hex") + '"';
};

module.exports = function(options, callback) {

    options = _.extend({}, options);

    if (typeof options.prepareResult !== 'function') {
        console.error('cached request call error: prepareResult not a function');
    }

    var prepareResult = options.prepareResult;
    delete options.prepareData;

    var key = hash(JSON.stringify(options));


    cache.get(key, function(error, data) {

        if (!error && data) {

            // Send cached data up.
            prepareResult(null, data.response, data.data, callback);

        } else {

            console.log('--- send request', options);
            request(options, function(error, response, data) {

                prepareResult(error, response, data, function(error, preparedData) {

                    if (!error) {
                        // If data prepared without error - cache it.
                        cache.set(key, {
                            response: {
                                statusCode: response && response.statusCode
                            },
                            data: data
                        });
                    }

                    // Send prepared data up.
                    callback(error, preparedData);
                });
            });
        }
    });
};
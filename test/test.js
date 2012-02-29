(function() {

var assert = require('assert');
var request = require('request');
var vows = require('vows');

var providers = require('./providers.json');

function checkCORS(uri, callback) {
    request({
        uri: uri,
        headers: {
            'Original': 'http://iframe.ly/'
        }
    }, function(err, res, data) {
        if (err) {
            callback(err);
            
        } else if (res.statusCode != 200) {
            callback({error: 'unexpected-code', code: res.statusCode});
            
        } else if (!res.headers['access-control-allow-origin']) {
            callback({error: 'cors-not-supported'});
            
        } else {
            callback(null, {ok: true});
        }
    });
}

function isOk(error, data) {
    assert.deepEqual(data, {ok: true});
}

function createTopic(url) {
    return {
        topic: function() {
            checkCORS(url, this.callback);
        },
        'supported': isOk
    };
}

function createBatch() {
    var batch = {};
    for (var p in providers) {
        batch[p] = createTopic(providers[p]);
    }
    
    return batch;
}

vows.describe('CORS Providers')
.addBatch(createBatch())['export'](module);

})();

(function() {

    var async = require('async');

    var API_URI = 'https://api.flickr.com/services/rest';

    exports.notPlugin = true;

    exports.getPhotoSizes = function(photo_id, request, api_key, callback) {
        request({
                uri: API_URI,
                qs: {
                    method: 'flickr.photos.getSizes',
                    format: 'json',
                    photo_id: photo_id,
                    api_key: api_key,
                    nojsoncallback: 1
                },
                json: true,
                jar: false
            },
            function (error, response, body) {
                callback(error || (body && body.message), body && body.sizes && body.sizes.size);
            });
    };

})();
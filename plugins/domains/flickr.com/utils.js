(function() {

    var async = require('async');

    var API_URI = 'https://api.flickr.com/services/rest';

    // TODO: config.providerOptions.flickr !!!

    exports.notPlugin = true;

    exports.mapGalleryImages = function(userId, photos) {
        return photos.map(function(photo) {
            return {
                title: photo.title,
                src: photo.url_l,
                thumbnail_src: photo.url_s,
                href: "http://flickr.com/photos/" + userId + "/" + photo.id,
                width: photo.width_l,
                height: photo.height_l
            };
        });
    }

    exports.getUserId = function(username, request, callback) {
        request({
                uri: API_URI,
                qs: {
                    method: 'flickr.people.findByUsername',
                    format: 'json',
                    username: username,
                    api_key: CONFIG.providerOptions.flickr.apiKey,
                    nojsoncallback: 1
                },
                json: true,
                jar: false
            },
            function (error, response, body) {
                callback(error || (body && body.message), body && body.user && body.user.nsid);
            });
    };

    exports.getPhotoSizes = function(photo_id, request, callback) {
        request({
                uri: API_URI,
                qs: {
                    method: 'flickr.photos.getSizes',
                    format: 'json',
                    photo_id: photo_id,
                    api_key: CONFIG.providerOptions.flickr.apiKey,
                    nojsoncallback: 1
                },
                json: true,
                jar: false
            },
            function (error, response, body) {
                callback(error || (body && body.message), body && body.sizes && body.sizes.size);
            });
    };

    exports.getPublicPhotos = function(user_id, request, callback) {
        request({
                uri: API_URI,
                qs: {
                    method: 'flickr.people.getPublicPhotos',
                    format: 'json',
                    user_id: user_id,
                    extras: 'url_l, url_s',
                    per_page: 10,
                    api_key: CONFIG.providerOptions.flickr.apiKey,
                    nojsoncallback: 1
                },
                json: true,
                jar: false
            },
            function (error, response, body) {
                callback(error || (body && body.message), body && body.photos && body.photos.photo);
            });
    };

    exports.getSetPhotos = function(photoset_id, request, callback) {
        request({
                uri: API_URI,
                qs: {
                    method: 'flickr.photosets.getPhotos',
                    format: 'json',
                    photoset_id: photoset_id,
                    extras: 'url_l, url_s',
                    api_key: CONFIG.providerOptions.flickr.apiKey,
                    nojsoncallback: 1
                },
                json: true,
                jar: false
            },
            function (error, response, body) {
                callback(error || (body && body.message), body && body.photoset && body.photoset.photo);
            });
    };

})();
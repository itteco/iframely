    var API_URI = 'https://api.flickr.com/services/rest';

    export const notPlugin = true;

    // TODO: is this used anywhere?

    export function getPhotoSizes(photo_id, request, api_key, cb) {
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
                jar: false,
                prepareResult: function (error, response, body, cb) {
                    cb(error || (body && body.message), body && body.sizes && body.sizes.size);
                }
            }, cb);
    };
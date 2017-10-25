module.exports = {

    provides: "vk_photo",

    re: [
        /^https?:\/\/(?:m|new\.)?vk\.com\/photo([0-9-]+)_(\d+)/i
    ],

    mixins: ["domain-icon"],

    getMeta: function (vk_photo, meta) {

        return {
            title: vk_photo.text || (meta.og && meta.og.title) || meta['html-title'],
            date: vk_photo.created
        }

    },

    getLinks: function(vk_photo) {

        return [{
            href: vk_photo.image,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }, {
            href: vk_photo.thumbnail,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail            
        }]

    },

    getData: function (urlMatch, meta, request, cb) {

        request({
            uri: "https://api.vk.com/method/photos.getById", //?photos=-27744747_376634226
            qs: {
                photos: urlMatch[1] + '_' + urlMatch[2]
            },
            json: true,
            prepareResult: function(error, b, data, cb) {

                if (error) {
                    return cb(error);
                }

                if (data.response && data.response.length > 0) {

                    var status = data.response[0];

                    cb(null, {
                        vk_photo: {
                            date: status.date,
                            text: status.text,
                            image: status.src_xbig || status.src_big,
                            thumbnail: status.src_big || status.src_small
                        }
                    });
                } else {
                    cb({responseStatusCode: 404});
                }
            }
        }, cb);


    },

    tests: [{
        skipMethods: ["getMeta"]
    },
        "https://vk.com/photo-27744747_376634226"
    ]

};
module.exports = {
    re: [
        /^https?:\/\/(?:[a-z]+-)?www\.envrmnt\.com\/#\/video\/([\w\-]+)\??([\w\-]+)?$/i
    ],

    mixins: ["*"],

    provides: 'envrmnt',

    getMeta: function (envrmnt) {
        return {
            videoId: envrmnt.videoId
        }
    },

    getData: function(urlMatch, request, cb) {
        var videoId = urlMatch[1];

        var metaURI = "http://media.envrmnt.com/media/vrexperience/" + videoId;

        request({
            uri: metaURI,
            prepareResult: function(error, response, body, cb) {
                if (error) {
                    return cb(error);
                }

                var bodyJSON = JSON.parse(body);

                cb(null, {
                    envrmnt: {
                        thumbnail: {
                            media: { width: 1286, height: 724 },
                            href: bodyJSON.thumbnailImageUrl,
                        },
                        videoId: videoId
                    }
                });
            }
        }, cb);

    },

    getLinks: function(urlMatch, envrmnt) {

        return [{
            type: CONFIG.T.text_html,
            rel: [
                CONFIG.R.player,
                CONFIG.R.inline,
                CONFIG.R.html5
            ],
            template_context: {
                id: envrmnt.videoId
            }
        }, {
            href: envrmnt.thumbnail.href,
            type: CONFIG.T.image_jpeg,
            rel: CONFIG.R.thumbnail,
            width: envrmnt.thumbnail.media.width,
            height: envrmnt.thumbnail.media.height
        }];
    },

    tests: [{
        noFeeds: true,
    },
        "http://www.envrmnt.com/#/video/6ec3f3f8-69f4-4b29-b64d-14992e19005f?3e6d6290-cd65-46b8-b4a6-1b1b6e3674d9",
        "http://www.envrmnt.com/#/video/619125f4-8c30-4549-bddb-4ece058797cb?c2efeabd-bb85-4363-b23c-e7f3eb7e160c",
        "http://www.envrmnt.com/#/video/ba1e1de1-54db-4962-8cac-40cd66aad44b"
    ]
};

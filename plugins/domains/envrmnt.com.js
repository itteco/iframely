module.exports = {
    re: [
        /^https?:\/\/(?:[a-z]+-)?www\.envrmnt\.com\/#\/video\/([\w\-]+)\?([\w\-]+)$/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "video",
        "twitter-description",
        "media-detector",
        "og-site",
        "twitter-title"
    ],

    provides: 'envrmnt',

    getMeta: function (envrmnt) {
        return {
            videoId: envrmnt.videoId
        }
    },

    getData: function(urlMatch, request, cb) {
        var fullUrl = urlMatch[0];
        var videoId = urlMatch[1];
        var userUUID = urlMatch[2];

        var metaURI = "http://cloud-media.envrmnt.com/media/vrexperience/"+videoId;

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
        var scriptURL = "http://www.envrmnt.com/lib/ext-embed-v1.js";
        var wrapperCSS = "width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;";
        var iframeSrc = "http://www.envrmnt.com/embed/v1/#/video/"+envrmnt.videoId;
        var iframeCss = "width: 100%; height: 100%; position: absolute;";

        var html = '<script async src="'+scriptURL+'"></script>'+
                   '<div style="'+wrapperCSS+'">'+
                   '<div><iframe id="envrmnt_'+envrmnt.videoId+'" data-envrmnt-id="'+envrmnt.videoId+'" data-vrplayer '+
                   'src="'+iframeSrc+'" frameborder="0" allowfullscreen '+
                   'style="'+iframeCss+'"></iframe></div>'+
                   '</div>';

        return [{
            type: CONFIG.T.text_html,
            rel: [
                CONFIG.R.player,
                CONFIG.R.inline,
                CONFIG.R.html5
            ],
            html: html
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
        "http://cloud-www.envrmnt.com/#/video/a4e56f72-5be9-4b08-bf59-51dd6b2b072f?4a41b15c-dce0-44e5-879f-c0d4b05713ab"
    ]
};

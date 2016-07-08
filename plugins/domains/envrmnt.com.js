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

        var metaURI = "http://cloud-www.envrmnt.com/share/?share="+videoId+"/"+userUUID;

        console.log("videoId", videoId);
        console.log("userUUID", userUUID);
        console.log("metaURI", metaURI);

        request({
            uri: metaURI,
            prepareResult: function(error, response, body, cb) {
                if (error) {
                    return cb(error);
                }

                console.log("status", body);

                cb(null, {
                    // TEMP Thumbnail while we resolve timeout issue
                    envrmnt: {
                        thumbnail: {
                            media: { width: 500, height: 500 },
                            href: "https://placekitten.com/g/500/500",
                        },
                        videoId: videoId
                    }
                });
            }
        }, cb);

    },

    getLinks: function(urlMatch, envrmnt) {
        var scriptURL = "http://fe-www.envrmnt.com/lib/ext-embed-v1.js";
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
    }
};

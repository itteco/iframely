module.exports = {

    re: [
        /^https?:\/\/www\.youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)$/i,
        /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/youtu.be\/([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:www\.)?youtube\.com\/tv#\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/www\.youtube\.com\/embed\/([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/www\.youtube\.com\/v\/([\-_a-zA-Z0-9]+)/i
    ],
        

    getData: function(urlMatch, request, cb) {

        var statsUri = "https://gdata.youtube.com/feeds/api/videos/" + urlMatch[1];

        request({
            uri: statsUri,
            qs: {
                v: 2,
                alt: "jsonc"
            },
            json: true
        }, function(error, b, data) {

            if (error) {
                return cb(error);
            }

            if (data.data) {

                cb(null, {
                    youtube_gdata: data.data
                });
            } else {
                cb(statsUri + " returned no data");
            }
        });
    },

    getMeta: function(youtube_gdata) {
        return {
            title: youtube_gdata.title,
            date: youtube_gdata.uploaded,
            author: youtube_gdata.uploader,
            category: youtube_gdata.category,
            description: youtube_gdata.description,
            duration: youtube_gdata.duration,
            likes: youtube_gdata.likeCount,
            views: youtube_gdata.viewCount,
            comments: youtube_gdata.commentCount,
            site: "YouTube"
        };
    },

    getLinks: function(youtube_gdata) {

        var params = (CONFIG.providerOptions.youtube && CONFIG.providerOptions.youtube.get_params) ? CONFIG.providerOptions.youtube.get_params : "";

        return [{
            href: "https://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png",
            type: CONFIG.T.image_png,
            rel: CONFIG.R.icon,
            width: 32,
            height: 32
        }, {
            href: youtube_gdata.thumbnail.sqDefault,
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: 120,
            height: 90
        }, {
            href: youtube_gdata.thumbnail.hqDefault,
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: 480,
            height: 360
        }, {
            href: '//www.youtube.com/embed/' + youtube_gdata.id + params,
            rel: CONFIG.R.player,
            type: CONFIG.T.text_html,
            "aspect-ratio": (youtube_gdata.aspectRatio === "widescreen") ? 16/9 : 4/3
        }];
    },

    tests: [{
        feed: "http://gdata.youtube.com/feeds/api/videos"
    },
        "http://www.youtube.com/watch?v=etDRmrB9Css",
        "http://www.youtube.com/embed/Q_uaI28LGJk"
    ]
};

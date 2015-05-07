module.exports = {

    notPlugin: !(CONFIG.providerOptions.youtube && CONFIG.providerOptions.youtube.apiKey),

    re: [
        /^https?:\/\/www\.youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)$/i,
        /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/youtu.be\/([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:www\.)?youtube\.com\/tv#\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/www\.youtube\.com\/embed\/([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/www\.youtube\.com\/v\/([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9]+\?v=([\-_a-zA-Z0-9]+)$/i,
        /^https?:\/\/www\.youtube\-nocookie\.com\/v\/([\-_a-zA-Z0-9]+)/i
    ],

    provides: 'youtube_video_data',

    getData: function(urlMatch, request, cb) {

        var statsUri = "https://www.googleapis.com/youtube/v3/videos";

        var id = urlMatch[1];

        request({
            uri: statsUri,
            qs: {
                part: "snippet,status,contentDetails,statistics,player",
                key: CONFIG.providerOptions.youtube.apiKey,
                id: id
            },
            json: true
        }, function(error, b, data) {

            if (error) {
                return cb(error);
            }

            var item = data.items && data.items[0];

            if (item) {

                var duration = 0;
                var m = item.contentDetails.duration.match(/(\d+)S/);
                if (m) {
                    duration += parseInt(m[1]);
                }
                m = item.contentDetails.duration.match(/(\d+)M/);
                if (m) {
                    duration += parseInt(m[1]) * 60;
                }
                m = item.contentDetails.duration.match(/(\d+)H/);
                if (m) {
                    duration += parseInt(m[1]) * 60 * 60;
                }

                cb(null, {
                    youtube_video_data: {
                        id              : id,
                        title           : item.snippet.title,
                        uploaded        : item.snippet.publishedAt,
                        uploader        : item.snippet.channelTitle,
                        description     : item.snippet.description,

                        thumbnails      : item.snippet.thumbnails,

                        duration        : duration,
                        definition      : item.contentDetails.definition,

                        viewCount       : item.statistics.viewCount,
                        likeCount       : item.statistics.likeCount,
                        dislikeCount    : item.statistics.dislikeCount,
                        commentCount    : item.statistics.commentCount
                    }
                });
            } else {
                cb({responseStatusCode: 404});
            }
        });
    },

    getMeta: function(youtube_video_data) {
        return {
            title: youtube_video_data.title,
            date: youtube_video_data.uploaded,
            author: youtube_video_data.uploader,
            description: youtube_video_data.description,
            duration: youtube_video_data.duration,
            views: youtube_video_data.viewCount,
            likes: youtube_video_data.likeCount,
            dislikes: youtube_video_data.dislikeCount,
            comments: youtube_video_data.commentCount,
            site: "YouTube"
        };
    },

    getLinks: function(url, youtube_video_data) {

        var params = (CONFIG.providerOptions.youtube && CONFIG.providerOptions.youtube.get_params) ? CONFIG.providerOptions.youtube.get_params : "";

        /** Extract ?t=12m15s, ?t=123, ?start=123, ?stop=123, ?end=123
        */
        try {     
            var start = url.match(/(?:t|start)=(\d+(?:m)?\d+(?:s)?)/i);
            var end = url.match(/(?:stop|end)=(\d+(?:m)?\d+(?:s)?)/i);

            if (start) {

                var m = start[1].match(/(\d+)m/);
                var s = start[1].match(/(\d+)s/);
                var time = 0;
                if (m) {
                    time = 60 * m[1];
                }
                if (s) {
                    time += 1 * s[1];
                }
                
                params = params + (params.indexOf ('?') > -1 ? "&": "?") + "start=" + (time ? time : start[1]);
            }

            if (end) {
                params = params + (params.indexOf ('?') > -1 ? "&": "?") + "end=" + end[1];
            }
        } catch (ex) {/* and ignore */}
        // End of time extractions

        var autoplay = params + (params.indexOf ('?') > -1 ? "&": "?") + "autoplay=1";

        var links = [{
            href: "https://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png",
            type: CONFIG.T.image_png,
            rel: CONFIG.R.icon,
            width: 32,
            height: 32
        }, {
            href: 'https://www.youtube.com/embed/' + youtube_video_data.id + params,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 16/9        // No data to get real aspect.
        }, {
            href: 'https://www.youtube.com/embed/' + youtube_video_data.id + autoplay,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            type: CONFIG.T.text_html,
            "aspect-ratio": 16/9
        }];

        var key;
        for(key in youtube_video_data.thumbnails) {
            var image = youtube_video_data.thumbnails[key];
            links.push({
                href: image.url,
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image_jpeg,
                width: image.width,
                height: image.height
            });
        }

        return links;
    },

    tests: [{
        noFeeds: true
    },
        "http://www.youtube.com/watch?v=etDRmrB9Css",
        "http://www.youtube.com/embed/Q_uaI28LGJk"
    ]
};

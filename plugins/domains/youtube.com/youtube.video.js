module.exports = {

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

    provides: 'youtube_video_gdata',

    getData: function(urlMatch, request, cb) {

        var statsUri = "https://gdata.youtube.com/feeds/api/videos/" + urlMatch[1];

        request({
            uri: statsUri,
            qs: {
                v: 2,
                alt: "json" // Unfortunatelly, even though `jsonc` is much simpler, it doesn't output `hd` attribute
            },
            json: true
        }, function(error, b, data) {

            if (error) {
                return cb(error);
            }

            if (data.entry) {

                cb(null, {
                    youtube_video_gdata: {

                        id: data.entry['media$group']['yt$videoid']['$t'],
                        title: data.entry.title['$t'],
                        uploaded: data.entry.published['$t'],
                        uploader: data.entry.author[0].name['$t'],
                        category: data.entry['media$group']['media$category'] ? data.entry['media$group']['media$category'][0].label : "",
                        description: data.entry['media$group']['media$description']['$t'],
                        duration: data.entry['media$group']['yt$duration'].seconds,
                        likeCount: data.entry['yt$rating'] ? data.entry['yt$rating'].numLikes : 0,
                        dislikeCount: data.entry['yt$rating'] ? data.entry['yt$rating'].numDislikes : 0,
                        viewCount: data.entry['yt$statistics'] ? data.entry['yt$statistics'].viewCount : 0,

                        hd: data.entry['yt$hd'] != null,
                        widescreen: data.entry['media$group']['yt$aspectRatio'] && data.entry['media$group']['yt$aspectRatio']['$t'] == "widescreen",

                        thumbnailBase: data.entry['media$group']['media$thumbnail'][0].url.replace(/[a-zA-Z0-9\.]+$/, '')
                    }
                });
            } else {
                cb({responseStatusCode: 404});
            }
        });
    },

    getMeta: function(youtube_video_gdata) {
        return {
            title: youtube_video_gdata.title,
            date: youtube_video_gdata.uploaded,
            author: youtube_video_gdata.uploader,
            category: youtube_video_gdata.category,
            description: youtube_video_gdata.description,
            duration: youtube_video_gdata.duration,
            likes: youtube_video_gdata.likeCount,
            dislikes: youtube_video_gdata.dislikeCount,
            views: youtube_video_gdata.viewCount,
            site: "YouTube"
        };
    },

    getLinks: function(url, youtube_video_gdata) {

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
            href: 'https://www.youtube.com/embed/' + youtube_video_gdata.id + params,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": youtube_video_gdata.widescreen ? 16/9 : 4/3
        }, {
            href: 'https://www.youtube.com/embed/' + youtube_video_gdata.id + autoplay,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            type: CONFIG.T.text_html,
            "aspect-ratio": youtube_video_gdata.widescreen ? 16/9 : 4/3
        }, {
            href: youtube_video_gdata.thumbnailBase + 'mqdefault.jpg',
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: 320,
            height: 180
        }];

        if (youtube_video_gdata.hd) {
            links.push({
                href: youtube_video_gdata.thumbnailBase + 'maxresdefault.jpg',
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image_jpeg
                // remove width so that image is checked for 404 as well
                // width: 1280,  // sometimes the sizes are 1920x1080, but it is impossible to tell based on API. 
                // height: 720   // Image load will take unnecessary time, so we hard code the size since aspect ratio is the same
            });
        }

        if (!youtube_video_gdata.widescreen) {
            links.push({
                href: youtube_video_gdata.thumbnailBase + 'hqdefault.jpg',
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image_jpeg,
                width: 480,
                height: 360
            });
        }

        return links;
    },

    tests: [{
        feed: "http://gdata.youtube.com/feeds/api/videos"
    },
        "http://www.youtube.com/watch?v=etDRmrB9Css",
        "http://www.youtube.com/embed/Q_uaI28LGJk"
    ]
};

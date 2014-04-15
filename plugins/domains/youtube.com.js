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

    provides: 'youtube_gdata',

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
                    youtube_gdata: {

                        id: data.entry['media$group']['yt$videoid']['$t'],
                        title: data.entry.title['$t'],
                        uploaded: data.entry.published['$t'],
                        uploader: data.entry.author[0].name['$t'],
                        category: data.entry['media$group']['media$category'] ? data.entry['media$group']['media$category'][0].label : "",
                        description: data.entry['media$group']['media$description']['$t'],
                        duration: data.entry['media$group']['yt$duration'].seconds,
                        likeCount: data.entry['yt$rating'] ? data.entry['yt$rating'].numLikes : 0,
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
            site: "YouTube"
        };
    },

    getLinks: function(youtube_gdata) {

        var params = (CONFIG.providerOptions.youtube && CONFIG.providerOptions.youtube.get_params) ? CONFIG.providerOptions.youtube.get_params : "";

        var links = [{
            href: "https://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png",
            type: CONFIG.T.image_png,
            rel: CONFIG.R.icon,
            width: 32,
            height: 32
        }, {
            href: 'https://www.youtube.com/embed/' + youtube_gdata.id + params,
            rel: CONFIG.R.player,
            type: CONFIG.T.text_html,
            "aspect-ratio": youtube_gdata.widescreen ? 16/9 : 4/3
        }, {
            href: youtube_gdata.thumbnailBase + 'mqdefault.jpg',
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: 320,
            height: 180
        }];

        if (youtube_gdata.hd) {
            links.push({
                href: youtube_gdata.thumbnailBase + 'maxresdefault.jpg',
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image_jpeg,
                width: 1280,  // sometimes the sizes are 1920x1080, but it is impossible to tell based on API. 
                height: 720   // Image load will take unnecessary time, so we hard code the size since aspect ratio is the same
            });
        }

        if (!youtube_gdata.widescreen) {
            links.push({
                href: youtube_gdata.thumbnailBase + 'hqdefault.jpg',
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

module.exports = {

    re: [
        /^https?:\/\/www\.youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)$/i,
        /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/youtu.be\/([\-_a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:www\.)?youtube\.com\/tv#\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/,
        /^https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([\-_a-zA-Z0-9]+)/],

    getData: function(urlMatch, request, cb) {

        var statsUri = 'https://gdata.youtube.com/feeds/api/videos?q=' + urlMatch[1] + '&v=2&alt=jsonc&max-results=1';

        request({
            uri: statsUri,
            json: true
        }, function(error, b, data) {

            if (error) {
                return cb(error);
            }

            if (data.data && data.data.items && data.data.items.length > 0) {

                cb(null, {
                    youtube_gdata: data.data.items[0]
                });
            } else {
                cb();
            }
        });
    },

    getMeta: function(youtube_gdata) {
        return {
            title: youtube_gdata.title,
            date: youtube_gdata.uploaded,
            category: youtube_gdata.category,
            description: youtube_gdata.description,
            duration: youtube_gdata.duration,
            likes: youtube_gdata.likeCount,
            views: youtube_gdata.viewCount,
            comments: youtube_gdata.commentCount
        };
    },

    getLinks: function(youtube_gdata) {

        return [{
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
            href: '//www.youtube.com/embed/' + youtube_gdata.id,
            rel: CONFIG.R.player,
            type: CONFIG.T.text_html,
            "aspect-ratio": 1.33
        }];
    },

    tests: [{
        feed: "http://gdata.youtube.com/feeds/api/videos"
    },
        "http://www.youtube.com/watch?v=etDRmrB9Css"
    ]
};

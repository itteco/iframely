var qs = require('querystring');

module.exports = {

    re: [
        /^https?:\/\/www\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/www\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i
    ],

    getMeta: function(facebook_video) {
        return {
            title: facebook_video.video_title,
            author: facebook_video.video_owner_name,
            author_url: facebook_video.video_owner_href,
            duration: facebook_video.video_seconds,
            canonical: facebook_video.video_href
        }
    },

    getLinks: function(facebook_video) {
        return [{
            href: '//www.facebook.com/favicon.ico',
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        }, {
            href: facebook_video.thumb_url,
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image,
            "aspect-ratio": facebook_video.video_width / facebook_video.video_height
        }, {
            href: "//www.facebook.com/video/embed?video_id=" + facebook_video.video_id,
            type: CONFIG.T.flash,
            rel: CONFIG.R.player,
            "aspect-ratio": facebook_video.video_width / facebook_video.video_height
        }, {
            href: facebook_video.video_src,
            type: CONFIG.T.video_mp4,
            rel: CONFIG.R.player,
            width: facebook_video.video_width,
            height: facebook_video.video_height
        }];
    },

    getData: function(urlMatch, request, cb) {
console.log(urlMatch);
        var statsUri = 'http://www.facebook.com/video/external_video.php?v=' + urlMatch[1];

        request({
            uri: statsUri
        }, function(error, response, body) {

            if (error){
                return cb(error);
            }

            try {
                var resp = qs.parse(body);
                var videoData = JSON.parse(resp.video);

                if (videoData.status != 'ok'){
                    return cb('Video API error ' + videoData.status);
                } else {
                    videoData = videoData.content;
                }
            } catch (ex) {
                return cb(ex);
            }

            cb(null, {
                facebook_video: videoData/*{
                    title:          videoData.video_title,
                    author:         videoData.video_owner_name,

                    thumbnail_url:  videoData.thumb_url,

                    width:          videoData.video_width,
                    height:         videoData.video_height,

                    duration:       videoData.video_seconds
                }*/
            });
        })
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        {
            noFeeds: true
        }
    ]
};
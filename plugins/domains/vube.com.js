module.exports = {

    re: /^http:\/\/vube\.com\/([^\/]+)\/([a-zA-Z0-9_-]+)/i,

    getData: function(urlMatch, request, cb) {
        request({
            uri: "http://vube.com/api/v2/video/" + urlMatch[2],
            json: true
        }, function(error, response, body) {
            if (error) {
                return cb(error);
            }
            cb(null, {
                vube: body
            });
        });
    },

    getMeta: function(vube) {
        return {
            title: vube.title,
            description: vube.description || vube.ucl_description,
            author: vube.user_alias,
            author_url: 'http://vube.com' + vube.channel_url,
            duration: vube.duration,
            views: vube.raw_view_count,
            date: vube.upload_time,
            canonical: 'http://vube.com' + vube.watch_url,
            category: vube._links.similar_videos.title,
            site: "Vube.com"
        };
    },    

    getLinks: function(vube, urlMatch) {

        var html = 

        '<script src="//m2.thestaticvube.com/web/js/assets/js/embed.js" data-swf="//m2.thestaticvube.com/web/vendor/flowplayer/flowplayer-commercial.swf" data-skin="//m2.thestaticvube.com/web/vendor/flowplayer/skin/minimalist.css">' + 
        '<div class="flowplayer" data-origin="' + urlMatch[0] + urlMatch[1] + urlMatch[2] +'"  style="width:100%;padding-bottom:56.5%;">' +
            '<video>' +
            '<source type="video/mp4" src="//video.thestaticvube.com/video/4/'+ vube.public_id +'.mp4">' +
        '</video></div></script>';

        return [{
            href: "http://vube.com/favicon.ico",
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        }, {
            href: '//frame.thestaticvube.com/snap/640x360/' + vube.public_id + '.jpg',
            type: CONFIG.T.image_jpeg,
            rel: CONFIG.R.thumbnail
        }, {
            html: html,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.inline],
            "aspect-ratio": 0.565,
            "max-width": 800
        }];
    },

    tests: [{
        noFeeds: true
    },
        "http://vube.com/De5tro/vE6XViQkTU/L/vote?t=s",
        "http://vube.com/SHIBAN/u2QvJwDVmw?t=s"
    ]
};
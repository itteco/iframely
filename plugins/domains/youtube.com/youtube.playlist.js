module.exports = {

    re: [
        /^https?:\/\/www\.youtube\.com\/playlist\?list=([\-_a-zA-Z0-9]+)$/i
    ],

    provides: 'youtube_playlist_gdata',

    getData: function(urlMatch, request, cb) {

        var statsUri = "https://gdata.youtube.com/feeds/api/playlists/" + urlMatch[1];

        request({
            uri: statsUri,
            qs: {
                v: 2,
                alt: "json"
            },
            json: true
        }, function(error, b, data) {

            if (error) {
                return cb(error);
            }

            cb(null, {
                youtube_playlist_gdata: {
                    id: data.feed['yt$playlistId']['$t'],
                    updated: data.feed.updated['$t'],
                    title: data.feed.title['$t'],
                    uploader: data.feed.author[0].name['$t'],
                    thumbnailBase: data.feed['media$group']['media$thumbnail'][0].url.replace(/[a-zA-Z0-9\.]+$/, '')

                }
            });
        });
    },

    getMeta: function(youtube_playlist_gdata) {
        return {
            title: youtube_playlist_gdata.title,
            date: youtube_playlist_gdata.updated,
            author: youtube_playlist_gdata.uploader,
            site: "YouTube"
        };
    },

    getLinks: function(url, youtube_playlist_gdata) {

        var params = (CONFIG.providerOptions.youtube && CONFIG.providerOptions.youtube.get_params) ? CONFIG.providerOptions.youtube.get_params : "";

        params = params.replace(/^\?/, '&');

        var autoplay = params + "&autoplay=1";

        var links = [{
            href: "https://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png",
            type: CONFIG.T.image_png,
            rel: CONFIG.R.icon,
            width: 32,
            height: 32
        }, {
            href: 'https://www.youtube.com/embed/videoseries?list=' + youtube_playlist_gdata.id + params,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 560/315
        }, {
            href: 'https://www.youtube.com/embed/videoseries?list=' + youtube_playlist_gdata.id + autoplay,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            type: CONFIG.T.text_html,
            "aspect-ratio": 560/315
        }, {
            href: youtube_playlist_gdata.thumbnailBase + 'mqdefault.jpg',
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: 320,
            height: 180
        }, {
            href: youtube_playlist_gdata.thumbnailBase + 'hqdefault.jpg',
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: 480,
            height: 360
        }];

        return links;
    },

    tests: [{
        feed: "https://gdata.youtube.com/feeds/api/playlists/snippets?v=2"
    },
        "https://www.youtube.com/playlist?list=PLWYwsGgIRwA9y49l1bwvcAF0Dj-Ac-5kh"
    ]
};

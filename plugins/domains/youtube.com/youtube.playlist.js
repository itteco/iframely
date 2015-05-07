module.exports = {

    notPlugin: !(CONFIG.providerOptions.youtube && CONFIG.providerOptions.youtube.apiKey),

    re: [
        /^https?:\/\/www\.youtube\.com\/playlist\?list=([\-_a-zA-Z0-9]+)$/i
    ],

    provides: 'youtube_playlist_data',

    getData: function(urlMatch, request, cb) {

        var statsUri = "https://www.googleapis.com/youtube/v3/playlists";

        var id = urlMatch[1];

        request({
            uri: statsUri,
            qs: {
                part: "snippet",
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
                cb(null, {
                    youtube_playlist_data: {
                        id              : id,
                        publishedAt     : item.snippet.publishedAt,
                        title           : item.snippet.title,
                        channelTitle    : item.snippet.channelTitle,
                        thumbnails      : item.snippet.thumbnails
                    }
                });
            } else {
                cb({responseStatusCode: 404});
            }

        });
    },

    getMeta: function(youtube_playlist_data) {
        return {
            title: youtube_playlist_data.title,
            date: youtube_playlist_data.publishedAt,
            author: youtube_playlist_data.channelTitle,
            site: "YouTube"
        };
    },

    getLinks: function(youtube_playlist_data) {

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
            href: 'https://www.youtube.com/embed/videoseries?list=' + youtube_playlist_data.id + params,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 560/315
        }, {
            href: 'https://www.youtube.com/embed/videoseries?list=' + youtube_playlist_data.id + autoplay,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            type: CONFIG.T.text_html,
            "aspect-ratio": 560/315
        }];

        var key;
        for(key in youtube_playlist_data.thumbnails) {
            var image = youtube_playlist_data.thumbnails[key];
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
        "https://www.youtube.com/playlist?list=PLWYwsGgIRwA9y49l1bwvcAF0Dj-Ac-5kh"
    ]
};

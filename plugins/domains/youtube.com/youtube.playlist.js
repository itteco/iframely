module.exports = {

    re: [
        /^https?:\/\/www\.youtube\.com\/playlist\?list=([\-_a-zA-Z0-9]+)$/i
    ],

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title"
    ],    

    getLinks: function(urlMatch) {

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
            href: 'https://www.youtube.com/embed/videoseries?list=' + urlMatch[1] + params,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 560/315
        }, {
            href: 'https://www.youtube.com/embed/videoseries?list=' + urlMatch[1] + autoplay,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            type: CONFIG.T.text_html,
            "aspect-ratio": 560/315
        }];

        return links;
    },

    tests: [{
        feed: "https://gdata.youtube.com/feeds/api/playlists/snippets?v=2"
    },
        "https://www.youtube.com/playlist?list=PLWYwsGgIRwA9y49l1bwvcAF0Dj-Ac-5kh"
    ]
};

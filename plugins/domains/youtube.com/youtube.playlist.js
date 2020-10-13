const querystring = require('querystring');

module.exports = {

    re: [
        /^https?:\/\/www\.youtube\.com\/playlist\?(?:[=\-_a-zA-Z0-9&]+)?list=([\-_a-zA-Z0-9]+)/i
    ],

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "og-description",
        "canonical",
        "domain-icon",
        "oembed-error"
    ],    

    getLinks: function(urlMatch, oembed, options) {
        
        var params = querystring.parse(options.getProviderOptions('youtube.playlist_params', '').replace(/^\?/, ''));
        var domain = /^https?:\/\/www\.youtube-nocookie\.com\//i.test(urlMatch[0]) || options.getProviderOptions('youtube.nocookie', false) ? 'youtube-nocookie' : 'youtube';

        if (options.getProviderOptions('players.playerjs', false) || options.getProviderOptions('players.autopause', false)) {
            params.enablejsapi = 1;
        }

        var qs = querystring.stringify(params);
        if (qs !== '') {qs = '&' + qs;}

        return {
            href: 'https://www.' + domain + '.com/embed/videoseries?list=' + urlMatch[1] + qs,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": oembed.width && oembed.height ? oembed.width / oembed.height : 16/9,
            autoplay: 'autoplay=1'
        }
    },

    tests: [{
        noFeeds: true,
        skipMixins: ["og-description", "oembed-error"]
    },
        "https://www.youtube.com/playlist?list=PLWYwsGgIRwA9y49l1bwvcAF0Dj-Ac-5kh",
        "https://www.youtube.com/playlist?disable_polymer=true&list=PLWYwsGgIRwA9y49l1bwvcAF0Dj-Ac-5kh"
    ]
};

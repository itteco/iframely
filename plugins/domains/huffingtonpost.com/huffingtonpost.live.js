module.exports = {

    re: [
        /^https?:\/\/live\.huffingtonpost\.com\/r\/highlight\/(?:[\w-]+\/)?(\w+)/i,
        /^https?:\/\/live\.huffingtonpost\.com\/r\/archive\/segment\/(?:[\w-]+\/)?(\w+)/i,
        /^https?:\/\/live\.huffingtonpost\.com\/r\/segment\/[\w-]+\/(\w+)/i,
        /^https?:\/\/live\.huffingtonpost\.com\/r\/segment\/(\w+)/i
    ],

    mixins: [
        "keywords",
        "twitter-title",
        "twitter-image",
        "domain-icon"
    ],

    getLinks: function(urlMatch, options) {

        var sid = options.getProviderOptions('huffingtonpost.sid');

        if (sid) {
            sid = '&sid=' + sid;
        } else {
            sid = '';
        }

        return [{
            href: 'http://embed.live.huffingtonpost.com/HPLEmbedPlayer/?segmentId=' + urlMatch[1] + '&autoPlay=false&showPlaylist=true' + sid,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 480/270
        }, {
            href: 'https://s.embed.live.huffingtonpost.com/HPLEmbedPlayer/?segmentId=' + urlMatch[1] + '&autoPlay=false&showPlaylist=true' + sid,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 480/270
        }];
    },

    tests: [
        "http://live.huffingtonpost.com/r/archive/segment/some-straight-men-are-attracted-to-men/51fa762478c90a12d0000469"
    ]

};
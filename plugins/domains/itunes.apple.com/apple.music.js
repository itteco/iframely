const URL = require('url');
const _ = require('underscore');

module.exports = {

    re: [
        /^https?:\/\/(?:geo\.)?itunes\.apple\.com\/(\w{2})\/(album)(?:\/[^\/]+)?\/id(\d+)\?i=(\d+)?/i,
        /^https?:\/\/(?:geo\.)?itunes\.apple\.com\/(\w{2})\/(album|playlist)(?:\/[^\/]+)?\/(?:id)?(?:pl\.)?(\w+)/i,
        /^https?:\/\/(?:geo\.)?itunes\.apple\.com\/()(album)\/id(\d+)\??/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, url, meta, options) {

        var canonical = meta.canonical || (meta.og && meta.og.url) || url;
        var isTrack =  /\?i=\d+/.test(canonical) || urlMatch[4] !== undefined;

        var at = null;
        if (options.redirectsHistory) {
            var original_url = _.find(options.redirectsHistory, function(u) {
                return u.indexOf('at=') > -1;
            });
            var query = original_url && URL.parse(original_url, true).query;
            at = query && query.at ? query.at : null;
        }

        var src = canonical.replace(/^https?:\/\/(?:geo\.)?itunes\.apple\.com/, 'https://embed.music.apple.com');
        if (at) {
            src += (/\?/.test(src) ? '&' : '?') + 'at=' + at;
        }

        return {
            href: src,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.playlist, CONFIG.R.html5],
            height: isTrack ? 150 : 450,
            'max-width': 700
        };
    },

    tests: [{
        noFeeds: true
    },
        'https://itunes.apple.com/us/album/12-12-12-concert-for-sandy/id585701590?v0=WWW-NAUS-ITSTOP100-ALBUMS&ign-mpt=uo%3D4',
        'https://itunes.apple.com/us/album/id944094900?i&ls=1',
        'https://itunes.apple.com/album/id1170687816?ls=1',
        "https://itunes.apple.com/album/id1125277620",
        'https://geo.itunes.apple.com/us/album/reaching-for-indigo/id1264016548?app=music',
        'https://itunes.apple.com/us/playlist/the-a-list-country/idpl.87bb5b36a9bd49db8c975607452bfa2b?app=music',
        'https://geo.itunes.apple.com/us/album/call-me-by-your-name-original-motion-picture-soundtrack/id1300430864?app=music',
        'https://geo.itunes.apple.com/uk/album/cozy-tapes-vol.-1-friends/id1169558406?app=music&at=1010lpzb',
        'https://itunes.apple.com/us/playlist/its-lit/idpl.2d4d74790f074233b82d07bfae5c219c?mt=1&app=music',
        'https://itunes.apple.com/jp/playlist/2019-3-16-maison-book-girl-%25E7%25A6%258F%25E5%25B2%25A1drum-son/pl.u-6mo4lNLiBvm0AAx?app=music',
        'https://itunes.apple.com/th/album/icecream/1263324000?i=1263324326',
        'https://itunes.apple.com/jp/album/%25E6%2584%259B%25E3%2581%2597%25E3%2581%259F%25E6%2597%25A5-single/1455190412',
        'https://itunes.apple.com/us/album/eartha/1450438412?i=1450438420'
    ]
};
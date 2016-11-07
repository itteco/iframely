module.exports = {

    re: [
        /^https?:\/\/(?:geo\.)?itunes\.apple\.com\/(\w{2})\/(album)(?:\/[^\/]+)?\/id(\d+)\?i=(\d+)?/i,
        /^https?:\/\/(?:geo\.)?itunes\.apple\.com\/(\w{2})\/(album|playlist)(?:\/[^\/]+)?\/id(?:pl\.)?(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {

        var country = urlMatch[1];
        var type =  urlMatch[2];        
        var id = urlMatch[4] || urlMatch[3];

        if (urlMatch[4]) {
            type = 'song';
        }

        return {
            href: '//tools.applemusic.com/embed/v1/' + type + '/' + (type === 'playlist' ? '/pl.':'/' ) + id + '?country=' + country,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.html5, CONFIG.R.player],
            "height": type === 'playlist' || type === 'album' ? 500 : 110
        };
    },

    tests: [
        'https://itunes.apple.com/us/album/12-12-12-concert-for-sandy/id585701590?v0=WWW-NAUS-ITSTOP100-ALBUMS&ign-mpt=uo%3D4',
        'https://itunes.apple.com/us/album/id944094900?i&ls=1',
        'https://geo.itunes.apple.com/us/album/trap-or-die-3/id1163301872?app=music',
        'https://geo.itunes.apple.com/us/album/fake-love/id1168503200?i=1168503281&mt=1&app=music',
        'https://itunes.apple.com/ca/album/greatest-feat.-kendrick-lamar/id1149503804?i=1149503816&app=music&ign-mpt=uo%3D4',
        'https://itunes.apple.com/us/playlist/the-a-list-country/idpl.87bb5b36a9bd49db8c975607452bfa2b?app=music',
        'https://geo.itunes.apple.com/uk/album/cozy-tapes-vol.-1-friends/id1169558406?app=music&at=1010lpzb'
    ]
};
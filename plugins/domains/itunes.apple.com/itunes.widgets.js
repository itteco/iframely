module.exports = {

    re: [
        /^https?:\/\/itunes\.apple\.com(?:\/)?(\w+)?\/(app|movie|tv-season)(?:\/[^\/]+)?\/id(\d+)/i
    ],

    mixins: [
        "canonical",
        "og-title",
        "og-site",
        "og-description",       
        "og-image",
        "favicon"
    ],

    getLink: function(urlMatch, options) {

        var content = {
            'app': 'software',
            'movie': 'movie',
            'tv-season': 'tvSeason'
        }[urlMatch[2]];

        if (content) {

            var country = urlMatch[1] ? urlMatch[1] : 'us';

            var width = options.maxWidth || 250;
            if (width > 325) {
                width = 325;
            }
            if (width < 250) {
                width = 250;
            }

            var embedSrc = 'https://widgets.itunes.apple.com/widget.html?c=' + country.toLowerCase() +'&e=' + content + '&w=' + width+ '&h=300&ids=' + urlMatch[3] + '&wt=discovery'

            return {
                href: embedSrc,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.summary, CONFIG.R.html5],
                "width": width,
                "height": 300
            };
        }
    },

    tests: [

        // Not supported.
        //'https://itunes.apple.com/us/music-video/gangnam-style/id564322420?v0=WWW-NAUS-ITSTOP100-MUSICVIDEOS&ign-mpt=uo%3D4',

        'https://itunes.apple.com/us/app/google-maps/id585027354?mt=8',
        "https://itunes.apple.com/app/2048/id840919914",
        'https://itunes.apple.com/us/movie/the-matrix/id271469518?ign-mpt=uo%3D4',
        'https://itunes.apple.com/us/tv-season/abc-news-specials/id183240032?uo=4',
        'https://itunes.apple.com/PT/app/hd-wallpapers-backgrounds-themes-for-lock-screen/id1214710121?ls=1&mt=8'
    ]
};
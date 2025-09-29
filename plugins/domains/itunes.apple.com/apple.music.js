import * as URL from 'url';

export default {

    re: [
        /^https?:\/\/music\.apple\.com\/\w{2}\/(album|playlist|music\-video)/i
    ],

    highestPriority: true,

    mixins: ["*"],

    getMeta: function () {
        return {
            medium: 'audio'
        }
    },

    getLink: function(iframe, og) {

        var isVideo = /^video/i.test(og.type);
        var isPlaylist = !/\?i=\d+/.test(iframe.src);

        return {
            href: iframe.src,
            type: CONFIG.T.text_html,

            rel: isVideo 
                ? CONFIG.R.player 
                : isPlaylist 
                        ? [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.playlist, CONFIG.R.resizable] 
                        : [CONFIG.R.player, CONFIG.R.audio],

            media: isVideo
                ? {
                    'aspect-ratio': 16 / 9
                } 
                : {
                    height: iframe.height
                }
        };
    },

    tests: [{
        noFeeds: true
    },
        'https://itunes.apple.com/us/album/12-12-12-concert-for-sandy/id585701590?v0=WWW-NAUS-ITSTOP100-ALBUMS&ign-mpt=uo%3D4',
        'https://itunes.apple.com/us/album/id1731059947?i&ls=1',
        "https://itunes.apple.com/album/id/1784748941",
        'https://itunes.apple.com/us/playlist/the-a-list-country/idpl.87bb5b36a9bd49db8c975607452bfa2b?app=music',
        'https://itunes.apple.com/us/playlist/its-lit/idpl.2d4d74790f074233b82d07bfae5c219c?mt=1&app=music',
        'https://itunes.apple.com/jp/playlist/2019-3-16-maison-book-girl-%25E7%25A6%258F%25E5%25B2%25A1drum-son/pl.u-6mo4lNLiBvm0AAx?app=music',
        'https://itunes.apple.com/th/album/icecream/1263324000?i=1263324326',
        'https://itunes.apple.com/us/album/eartha/1450438412?i=1450438420',
        'https://music.apple.com/jp/album/back-to-the-80s/1458246986',
        'https://music.apple.com/us/album/gypsy-woman-shes-homeless-basement-boy-strip-to-the-bone-mix/1434891258?i=1434891369',
        'https://geo.itunes.apple.com/us/album/reaching-for-indigo/id1264016548?app=music',
        'https://geo.itunes.apple.com/us/album/charlie-single/1839272690?ls=1&app=itunes',
        'https://music.apple.com/es/music-video/just-the-way-you-are/576670472'
    ]
};
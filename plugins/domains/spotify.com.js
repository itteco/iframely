module.exports = {

    mixins: [
        "og-title",
        "og-image",
        "music-duration",
        "canonical",
        "og-site",
        "favicon"
    ],

    getMeta: function(meta) {

        if (!meta.music)
            return;

        return {
            date: meta.music.release_date
        };
    },

    getLink: function(meta) {
        if (!meta.og.audio) return;

        return [{
            href: 'https://embed.spotify.com/?uri=' + meta.og.audio.url,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 250,
            height: 80
        }];
    },

    tests: [
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "http://open.spotify.com/user/cgwest23/playlist/4SsKyjaGlrHJbRCQwpeUsz",
        "http://open.spotify.com/user/davadija/playlist/3uIJTf7ArvF7VmeO41F8T5",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi",
        {
            skipMixins: [
                "music-duration"
            ],
            skipMethods: [
                "getMeta"
            ]
        }
    ]
};
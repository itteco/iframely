module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-video-responsive"
    ],

    // keep dependency on oEmbed only. Otherwise, there's redirect to relative path and no embeds as a result
    getLink: function() {

        return {
            href: "http://d2c87l0yth4zbw.cloudfront.net/i/_global/favicon.png",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        };
    },

    tests: [
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "http://open.spotify.com/user/cgwest23/playlist/4SsKyjaGlrHJbRCQwpeUsz",
        "http://open.spotify.com/user/davadija/playlist/3uIJTf7ArvF7VmeO41F8T5",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi"
    ]
};
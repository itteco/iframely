module.exports = {

    re: [
        /^https?:\/\/www\.break\.com\/video\//i
    ],    

    mixins: [
        "*"
    ],

    getLink: function(meta) {

        if (meta.embed_video_url && /^https?:\/\/www\.break\.com\/embed\/\d+/i.test(meta.embed_video_url)) {

            var id = meta.embed_video_url.match(/^https?:\/\/www\.break\.com\/embed\/(\d+)/i)[1];
            // no '/' at the end and no ?embed=1

            return {
                href: '//www.break.com/embed/' + id + '?embed=1',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 464 / 280
            }
        }
    },

    tests: [
        "http://www.break.com/video/this-girl-is-not-a-fan-of-litterbugs-2759576",
        "http://www.break.com/video/how-to-get-downstairs-in-russia-3028517"
    ]
};
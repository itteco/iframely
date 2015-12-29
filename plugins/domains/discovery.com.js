module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(meta, og) {

        if (og.video && meta.shortlink && /https?:\/\/www\.discovery\.com\/\?p=\d+/i.test(meta.shortlink)) {

            var id = meta.shortlink.match(/https?:\/\/www\.discovery\.com\/\?p=(\d+)/i)[1];

            return {
                href: "http://www.discovery.com/embed?page=" + id,
                rel: [CONFIG.R.player], // not html5, not ssl
                type: CONFIG.T.text_html,
                "aspect-ratio": 16 / 9
            }
        }

    },

    tests: [
        "http://www.discovery.com/tv-shows/mythbusters/videos/hindenburg-minimyth/"
    ]
};
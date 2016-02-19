module.exports = {

    re: /^https?:\/\/abc\.go\.com\/shows\/[\w\-]+\/video\/(?:most\-recent\/|featured\/)?([a-zA-Z0-9_]+)/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {

        return {
            href: "//abc.go.com/embed/" + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': 644/362
        };
    },

    tests: [
        "http://abc.go.com/shows/jimmy-kimmel-live/video/most-recent/vdka0_uujyfy0k",
        "http://abc.go.com/shows/bachelor-live/video/VDKA0_phcdyfk5"
    ]

};
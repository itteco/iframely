module.exports = {

    re: [
        /^https?:\/\/d\.pr\/i\/([a-z0-9]+)/i
    ],

    mixins: [
        "oembed-thumbnail",
        "oembed-site",
        "oembed-title"

    ],

    getLinks: function(oembed) {
        return {
            href: oembed.url,
            type: CONFIG.T.image,
            rel: CONFIG.R.image,
            width: oembed.width,
            height: oembed.height
        };
    },

    tests: [
        "http://d.pr/i/p6ot"
    ]
};
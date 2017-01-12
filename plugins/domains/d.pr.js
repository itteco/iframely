module.exports = {

    re: [
        /^https?:\/\/(\w+\.)?d\.pr\/(?:i\/)([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "oembed-thumbnail",
        "oembed-site",
        "oembed-title"

    ],

    getLink: function(oembed) {

        if (oembed.type == "image" || oembed.type == "photo") {
            return {
                href: oembed.url,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
                // verify that image exists, omit sizes
                // width: oembed.width,
                // height: oembed.height
            };
        }
    },

    tests: [
        "http://d.pr/i/9jB7",
        // "http://d.pr/i/vO1p" // 404
    ]
};
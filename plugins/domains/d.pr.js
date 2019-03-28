module.exports = {

    re: [
        /^https?:\/\/(\w+\.)?d\.pr\/(?:i\/)?([a-zA-Z0-9]+)/i
    ],

    // oembeds here to avoid redirects for 404s
    mixins: [
        "oembed-thumbnail",
        "oembed-site",
        "oembed-title"
    ],

    getLink: function(oembed) {

        if ( /image|photo/.test(oembed.type) || /image/i.test(oembed.drop_type)) {
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

    tests: [{
        noFeeds: true
    },
        "http://d.pr/i/9jB7"
        // "http://d.pr/i/vO1p" // 404
    ]
};
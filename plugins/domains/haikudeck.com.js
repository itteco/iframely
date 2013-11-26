module.exports = {
    re: [
        /^http?:\/\/www\.haikudeck\.com\/p\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_\-]+)$/i,
    ],

    mixins: [
        "canonical",
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author"
    ],

    // getMeta: function(meta) {
    //     console.log(meta);
    //     return {
    //         title: meta.og.title,
    //         description: meta.description
    //     };
    // },

    getLink: function(urlMatch) {
        console.log('=== url Match ===');
        console.log(urlMatch);
        console.log('=== url Match ===');

        return [{
            href: "http://www.haikudeck.com/e/"+urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 640 / 541
        }];
    },


    tests: [
        "http://slid.es/timkindberg/ui-router"
    ]
};

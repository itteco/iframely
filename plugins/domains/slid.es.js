module.exports = {
    re: [
        /^http?:\/\/slid\.es\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    mixins: [
        "canonical",
        "twitter-title",
        "twitter-image",
        "og-site",
        "favicon"
    ],

    getMeta: function(meta) {

        return {
            author: meta.og.title.split('by ')[1],
        };
    },

    getLink: function(urlMatch) {

        return [{
            href: urlMatch[0]+"/embed",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 640 / 360
        }];
    },


    tests: [
        "http://slid.es/timkindberg/ui-router"
    ]
};

module.exports = {
    re: [
        /^http?:\/\/slid\.es\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    mixins: [
        "canonical",
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author"
    ],

    getMeta: function(meta) {
        return {
            title: meta.og.title,
            description: meta.description
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

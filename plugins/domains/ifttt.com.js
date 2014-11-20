module.exports = {

    re: /^https?:\/\/ifttt\.com\/recipes\/([0-9_-]+)/i,

    mixins: [
        "twitter-image",
        "favicon",
        "canonical",
        "copyright",
        "twitter-description",
        "keywords",
        "og-site",
        "twitter-title"
    ],

    getLink: function(oembed) {
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline],
            html: oembed.html
        };
    },

    tests: [
        "https://ifttt.com/recipes/116160"
    ]
};
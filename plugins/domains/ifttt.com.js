module.exports = {

    re: /https?:\/\/ifttt\.com\/recipes\/\d+/i,

    mixins: ["*"],

    getLink: function(oembed) {

        return {
            html: oembed.html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.inline],
            height: oembed.height,
            type: CONFIG.T.text_html            
        };
    },

    tests: [
        "https://ifttt.com/recipes/13341"
    ]
};
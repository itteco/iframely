module.exports = {

    re: /^https?:\/\/sportsyapper\.com\/yapp\/(\d+)/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-description",
        "keywords",
        "og-site",
        "twitter-title"    
    ],

    getLink: function(urlMatch) {

        return {
            template_context: {
                id: urlMatch[1],
            },
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline]
        };
    },

    tests: [
        "http://sportsyapper.com/yapp/14011979516003659"
    ]
};
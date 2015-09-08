module.exports = {

    re: [
        /^https?:\/\/s3\.amazonaws\.com\/(uploads|CDN)\.knightlab\.com\/storymapjs\/\w+\/([a-zA-Z0-9\-\/]+)\.html/i        
    ],

    mixins: ["*"],

    getLink: function(url) {

        return {
                href: url + '?for=iframely',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.html5],
                "height": 800
            };
    },

    tests: [
        "https://s3.amazonaws.com/uploads.knightlab.com/storymapjs/86a5b5c6facef8e74eb685573b846f6b/civilian-deaths-evidence-of-war-crimes-in-yemen/index.html"
    ]
};
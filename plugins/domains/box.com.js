module.exports = {

    re: [
        /^https:\/\/app\.box\.com\/(?:embed|embed_widget)?\/?s\/([a-zA-Z0-9]+)/,
        /^https:\/\/(\w+)\.app\.box\.com\/(?:embed|embed_widget)?\/?s\/([a-zA-Z0-9]+)/,
        /^https:\/\/app\.box\.com\/embed\/preview\/([a-zA-Z0-9]+)/,
        /^https:\/\/(\w+)\.app\.box\.com\/embed\/preview\/([a-zA-Z0-9]+)/,
    ],

    mixins: ["favicon", "html-title", "initial-state"],
    provides: '__initialStateNeeded',

    getMeta: function(initialState) {
        var itemKey = Object.keys(initialState).find(key => initialState[key].items instanceof Array);
        if (itemKey) {
            var item = initialState[itemKey].items[0];
            return {
                title: item.name
            }
        }

    },

    getLink: function(urlMatch) {
        // Docs are at https://developers.box.com/box-embed/
        return {
            href: urlMatch.length > 2 ? "https://" + urlMatch[1] + ".app.box.com/embed_widget/s/" + urlMatch[2] : "https://app.box.com/embed_widget/s/" + urlMatch[1],
            rel: [CONFIG.R.reader, CONFIG.R.oembed, CONFIG.R.html5, CONFIG.R.ssl],
            type: CONFIG.T.text_html,
            "aspect-ratio": 500 / 400
        }
    },

    getData: function(options) {
        options.__VAR_NAME__ = 'Box.postStreamData';
        return {
            __initialStateNeeded: true
        }
    },

    tests: [{
        noFeeds: true
    }]
};
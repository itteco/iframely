
module.exports = {

    re: [
        /https?:\/\/(www|app)\.slidecaptain\.com\/flows\/([a-zA-Z0-9]+)\/([a-zA-Z0-9\-]+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "keywords",
        "og-title"
    ],    

    getMeta: function (meta) {
        return {
            "site": meta["generator"]
        }
    },
    
    getLink: function(meta) {
        if (meta.og.url) {

            return {
                href: meta.og.url.replace("www.", "app.") + "/embed",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 4/3   // It's actually more flexible, but it'll be better handled at oEmbed endpoint this way.
            };
        }
    },

    tests: [
        "http://www.slidecaptain.com/flows/51dbfee3896082260f0001f5/background-images-and-colors/embed",
        "http://www.slidecaptain.com/flows/51dbfee3896082260f0001f5/background-images-and-colors/"
    ]

};
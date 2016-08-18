module.exports = {

    mixins: [
        "*"
    ],

    getMeta: function (schemaVideoObject) {

        // if schemaVideoObject -> media=player
        return {
            media: "player"
        }

    },

    getLink: function(schemaVideoObject) {

        if (schemaVideoObject.embedURL || schemaVideoObject.embedUrl) {

            return {
                href: schemaVideoObject.embedURL || schemaVideoObject.embedUrl,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html, 
                "aspect-ratio": 16/9,
                'padding-bottom': 75, //ignore branding overlay of 50px- it gets removed on playback
                scrolling: 'no'
            };
        }
    },

    tests: [
        "http://www.nbcnews.com/video/obama-america-is-not-as-divided-as-some-suggest-721895491854"
    ]
};
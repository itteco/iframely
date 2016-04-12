module.exports = {

    mixins: [
        "*"
    ],

    highestPriority: true, 

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
                'padding-bottom': 65 //ignore branding overlay of 50px- it gets removed on playback
            };
        }
    },

    tests: [
        "http://www.nbcnews.com/nightly-news/nypds-wenjian-liu-remembered-wake-n279116"
    ]
};
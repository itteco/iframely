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
                "aspect-ratio": 4/3 // Fixes it for NBC news
            };
        }
    },

    tests: [
        "http://www.nbcnews.com/nightly-news/nypds-wenjian-liu-remembered-wake-n279116"
    ]
};
module.exports = {

    re: [
        /^https?:\/\/video\.vice\.com\/(\w{2}_\w{2})\/video\/[^\/]+\/(\w+)/i        
    ],

    provides: '__allowEmbedURL',

    mixins: ["*"],

    getLink: function(urlMatch, schemaVideoObject) {

        // schemaVideoObject arg is here to make sure there's an embeddable vid on the page

        if (schemaVideoObject.embedURL || schemaVideoObject.embedUrl) {
            return {
                href: 'https://video.vice.com/' + urlMatch[1] + '/embed/' + urlMatch[2],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 560 / 315
            };
        }
    },

    getData: function (urlMatch) {
            // this extracts proper meta from SchemaVideo microformat, but does not white-list embedURL automatically
            return {
                __allowEmbedURL: true
            };        
    },

    tests: [
        "https://video.vice.com/en_us/video/what-it-means-to-be-a-drum-major-scene/5733a7bc93a621680434f5a0?latest=1"
    ]
};
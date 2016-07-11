module.exports = {

    re: /^https?:\/\/bigthink\.com\/videos\//i,

    mixins: [
        "*"
    ],

    provides: '__allowEmbedURL',

    getData: function(urlMatch) {
        return {
            __allowEmbedURL: true
        };
    },

    tests: [
        "http://bigthink.com/videos/bre-pettis-on-makerbot-3-d-printing"
    ]
};
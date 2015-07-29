module.exports = {

    re: /https?:\/\/i\.(\w+)?\.?imgur\.com\/(\w+)\.(jpg|gif|png|gifv)(\?.*)?$/i,

    mixins: [
        "canonical",
    ],

    getLink: function(urlMatch) {
        return {
            href: urlMatch[0],
            type: CONFIG.T.image,
            rel: [CONFIG.R.image],
        };
    },

    tests: [{
        noFeeds: true
    }]
};

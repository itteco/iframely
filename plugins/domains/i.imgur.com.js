module.exports = {

    re: /https?:\/\/i\.imgur\.com\/(\w+)\.(jpg|gif|png|gifv)(\?.*)?$/i,

    mixins: false,

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "http://imgur.com/" + urlMatch[1]
        });
    },

    tests: [{
        noFeeds: true
    }]
};
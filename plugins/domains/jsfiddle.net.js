module.exports = {

    re: /(https?:\/\/jsfiddle.net\/(?:\w+\/)?\w+\/).*/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        return {
            href: urlMatch[1].replace(/^http:\/\//i, '//') + "embedded/",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.app
        };
    },

    tests: [
        "http://jsfiddle.net/pborreli/pJgyu/",
        "http://jsfiddle.net/timwienk/LgJsN/",
        {
            noFeeds: true
        }
    ]
};
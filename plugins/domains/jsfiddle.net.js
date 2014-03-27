module.exports = {

    re: /(http:\/\/jsfiddle.net\/(?:\w+\/)?\w+\/).*/i,

    mixins: [
        "html-title",
        "copyright",
        "description",

        "favicon"
    ],

    getLink: function(urlMatch) {
        return {
            href: urlMatch[0] + "embedded/",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader
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
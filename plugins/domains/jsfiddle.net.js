module.exports = {

    re: /(https?:\/\/jsfiddle.net\/(?:\w+\/)?\w+\/).*/i,

    mixins: [
        "html-title",
        "copyright",
        "description",

        "favicon"
    ],

    getLink: function(urlMatch) {
        return {
            href: urlMatch[1] + "embedded/",
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
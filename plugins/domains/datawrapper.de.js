module.exports = {
    re: [
        /^http[s]?:\/\/cf.datawrapper.de\/(.+?)(?:[\/](?:index\.html)?)?$/
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            href: "http://cf.datawrapper.de/" + urlMatch[1] + "/?for=iframely",
            height: 350
        }
    },

    getMeta: function(meta) {
        return {
            site: 'datawrapper'
        };
    },

    tests: [
        "http://cf.datawrapper.de/zjCKi/2/",
        "http://cf.datawrapper.de/Gx44C/21/",
        "http://cf.datawrapper.de/RrO5t/2/"
    ]
};

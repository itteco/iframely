export default {
    re: [
        /^https?:\/\/slides\.com\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    highestPriority: true, 

    mixins: [
        "*", "query"
    ],

    getMeta: function(urlMatch) {
        return {
            medium: 'slideshow'
        }
    },

    getLink: function(urlMatch, query) {

        return {
            href: `${urlMatch[0].replace('http://', '//')}/embed` + (query.token ? `?token=${query.token}` : ''),
            accept: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.slideshow, CONFIG.R.html5],
            'aspect-ratio': 960/700,
            'padding-bottom': 34
        };
    },

    getData: function (url, cb) {

        cb (/^(https?:\/\/slides\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+)\/embed/i.test(url)
            ? {redirect: url.match(/^(https?:\/\/slides\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+)\/embed/i)[1]} 
            : null);
    },

    tests: [{skipMethods: ["getData"]},
        "http://slides.com/timkindberg/ui-router",
        "https://slides.com/thedatacentral/the-data-central",
        "https://slides.com/jbsaurine/gpe?token=hYf8nobC",
        "https://slides.com/webmax/angular-status-13"
    ]
};

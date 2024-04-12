export default {
    re: [
        /^https?:\/\/([a-zA-Z0-9\-]+\.)?slides\.com\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    highestPriority: true, 

    mixins: [
        "*", "query"
    ],

    getMeta: function(urlMatch) {
        if (urlMatch[1] !== 'blog.') {
            return {
                medium: 'slideshow'
            }
        }
    },

    getLink: function(urlMatch, query) {
        if (urlMatch[1] !== 'blog.') {
            return {
                href: `${urlMatch[0].replace('http://', '//')}/embed` + (query.token ? `?token=${query.token}` : ''),
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.slideshow],
                'aspect-ratio': 960/700,
                'padding-bottom': 34
            };
        }
    },

    getData: function (url, cb) {

        cb (/^(https?:\/\/slides\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+)\/embed/i.test(url)
            ? {redirect: url.match(/^(https?:\/\/slides\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+)\/embed/i)[1]} 
            : null);
    },

    tests: [{skipMethods: ["getData"]},
        "http://slides.com/timkindberg/ui-router",
        "https://slides.com/thedatacentral/the-data-central",
        "https://slides.com/sunilos/javaio#/2",
        "https://slides.com/webmax/angular-status-13"

        // But exclude http://blog.slides.com/post/84828911898/slides-turns-one-year-old from Tumblr tests
    ]
};

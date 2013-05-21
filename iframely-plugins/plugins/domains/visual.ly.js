module.exports = {

    re: /^https?:\/\/visual\.ly\/[\w\-]+/i,

    mixins: [
        "html-title"
    ],

    getLinks: function($selector, meta) {

        var $el = $selector('a#ig-graphic-container');
        var original = $el.attr('href');
        var title = $el.attr('title');

        return [{
            title: title,
            href: meta.og.image,
            type: CONFIG.T.image_jpeg,
            rel: [CONFIG.R.thumbnail, CONFIG.R.og],
            width: 250,
            height: 250
        }, {
            title: title,
            href: original,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }];
    },

    tests: [{
        pageWithFeed: "http://visual.ly/"
    },
        "http://visual.ly/spring-cleaning-improve-energy-efficiency"
    ]
};
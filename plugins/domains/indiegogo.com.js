module.exports = {

    re: /^https:\/\/www\.indiegogo\.com\/projects\/([\w-]+)/i,

    mixins: [
        "og-site",
        "og-image",
        "image_src",
        "canonical",
        "favicon",
        "twitter-description",
        "keywords",
        "twitter-title"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'https://www.indiegogo.com/project/' + urlMatch[1] + '/embedded',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.app,
            width: 222,
            height: 445
        };
    },

    tests: [{
        pageWithFeed: 'https://www.indiegogo.com'
    }, {
        skipMixins: ['image_src']
    },
        "https://www.indiegogo.com/projects/the-intel-80386-and-80486/"
    ]
};
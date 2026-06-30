export default {

    re: [
        /^https?:\/\/readymag\.com\/\w+\/(\d+)/i,
        /^https?:\/\/readymag\.website\/\w+\/(\d+)/i
    ],

    mixins: ["*"],

    getLink: function(url) {

        return {
                href: url.replace('readymag.com/', 'readymag.website/'),
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.iframely],
                'aspect-ratio': 4/3
            };

    },

    tests: [
        "https://readymag.com/rbphotography/57005/",
        "https://readymag.website/rbphotography/57005/",
        "https://readymag.website/rbphotography/57005/11/",
    ]
};
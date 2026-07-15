export default {

    re: [
        /^https:\/\/readymag\.website\/\w+\/\d+/i
    ],

    mixins: ["*"],

    getLink: function(url) {
        return {
            // https://help.readymag.com/hc/en-us/articles/4417292690587-Embedding-project-as-iframe
            href: url,
            accept: CONFIG.T.text_html, // Headers can prevent iFrame'ing
            rel: [CONFIG.R.app, CONFIG.R.iframely],
            'aspect-ratio': 4/3
        };
    },

    tests: [
        "https://readymag.com/rbphotography/57005/",
        "https://readymag.website/rbphotography/57005/",
        "https://readymag.website/rbphotography/57005/11/"
    ]
};
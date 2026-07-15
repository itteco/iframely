export default {

    re: [
        /^https:\/\/readymag\.website\/[\w-]+\/[\w-]+/i
    ],

    mixins: ["*"],

    getLink: function(url, headers) {
        if (headers && headers['x-frame-options'] && /^(deny|sameorigin)$/i.test(headers['x-frame-options'])) {
            return {message: 'Enable embedding in your Readymag settings first'};
        }
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
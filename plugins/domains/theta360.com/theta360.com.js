module.exports = {

    re: /https:\/\/theta360\.com\/(?:spheres|s)(?:\/\w+)?\/[\w-]+/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(og) {
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.inline, CONFIG.R.ssl],
            template_context: {
                title: og.title,
                description: og.description,
                url: og.url
            },
            "aspect-ratio": 16/9
        };
    },

    tests: [
        {
            page: 'https://theta360.com/en/gallery/',
            selector: '.library .item a',
            skipMixins: [
                "og-description"
            ]
        },
        "https://theta360.com/spheres/samples/2aec9a48-0a2b-11e3-95cf-080027b212e7-1",
        "https://theta360.com/s/4CnG2mvnQDRE5NRFAU2sigrc8"

    ]
};
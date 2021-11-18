export default {

    re: /^https?:\/\/(?:web\.)?500px\.com\/photo\/(\d+)/i,

    mixins: ["*"],

    getLinks: function(urlMatch, twitter) {
        if (twitter.card === 'photo' && twitter.image) {
            return {
                template_context: {
                    title: twitter.title + ' | ' + twitter.site,
                    img_src: twitter.image.src,
                    id: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.image, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                "aspect-ratio": twitter.image.height ? twitter.image.width / twitter.image.height : null
            }
        }
    },

    getData: function(options) {
        options.timeout = 40 * 1000;
    },

    tests: [{skipMethods:['getData']},{
        feed: "https://500px.com/upcoming.rss"
    },
        "https://web.500px.com/photo/13541787/Long-After-Sunset-In-The-Black-Mountains-by-Jim-Ross/",
        "https://500px.com/photo/56891080/frozen-by-ryan-pendleton?ctx_page=1&from=user&user_id=116369"
    ]
};
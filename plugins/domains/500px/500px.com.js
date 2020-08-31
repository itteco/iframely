module.exports = {

    re: /^https?:\/\/(?:web\.)?500px\.com\/photo\/(\d+)/i,

    mixins: [
        "oembed-photo",
        "domain-icon",
        "oembed-author",
        "oembed-site",
        "oembed-title"
    ],

    getLinks: function(urlMatch, oembed) {
        if (oembed.type === 'photo') {
            return {
                template_context: {
                    title: oembed.title + ' | ' + oembed.provider_name,
                    img_src: oembed.url,
                    id: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.image, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                "aspect-ratio": oembed.width / oembed.height
            }
        }
    },

    tests: [{
        feed: "https://500px.com/upcoming.rss"
    },
        "https://web.500px.com/photo/13541787/Long-After-Sunset-In-The-Black-Mountains-by-Jim-Ross/",
        "https://500px.com/photo/56891080/frozen-by-ryan-pendleton?ctx_page=1&from=user&user_id=116369"
    ]
};
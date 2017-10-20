module.exports = {

    re: /^https?:\/\/www\.vox\.com\/cards\/([a-z0-9\-]+)/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
            
            return {
                template_context: {
                    slug: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5]
        }
    },

    tests: [
        "http://www.vox.com/cards/iowa-caucus-2016-polls"
    ]
};
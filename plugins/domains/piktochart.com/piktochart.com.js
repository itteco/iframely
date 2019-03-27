module.exports = {

    re: /^https?:\/\/(?:magic|create)\.piktochart\.com\/output\/(\d+\-[\-a-zA-Z-0-9_]+)/i,

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch) {
        return {

            template_context: {
                id: urlMatch[1]
            },
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl],
        };
    },

    tests: [
        "https://magic.piktochart.com/output/16505417-projet-immigration-copy"
    ]

};
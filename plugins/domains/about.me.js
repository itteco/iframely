module.exports = {

    re: /http:\/\/about\.me\/([a-zA-Z0-9\-]+)/i,

    mixins: [
        "twitter-image",
        "thumbnail",
        "og-image",
        "favicon",
        "author",
        "canonical",
        "twitter-description",
        "keywords",
        "og-site",
        "twitter-title"
    ],

    getLink: function(urlMatch) {

        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template: "embed-html",
            template_context: {
                title: urlMatch[1],
                html: '<script type="text/javascript" src="' + "//about.me/embed/" + urlMatch[1] +  '"></script>'
            }            
        };
    },

    tests: [
        "http://about.me/KevinRose"
    ]
};
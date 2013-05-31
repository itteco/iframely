module.exports = {

    re: /^https?:\/\/gist\.github\.com\/(\w+\/)?(\d+)/i,

    mixins: [
        "og-title",
        "og-site",
        "favicon"
    ],

    getLink: function(urlMatch, meta) {
        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template: "embed-html",
            template_context: {
                title: meta.og.title,
                html: '<script type="text/javascript" src="https://gist.github.com/' + urlMatch[2] +'.js"></script>'
            }
        };
    },

    tests: [{
        page: "https://gist.github.com/discover",
        selector: ".creator a:last"
    },
        "https://gist.github.com/3054754",
        "https://gist.github.com/2719090"
    ]
};
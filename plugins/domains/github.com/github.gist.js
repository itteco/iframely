module.exports = {

    re: /^https?:\/\/gist\.github\.com\/(\w+\/)(\w+)/i,

    mixins: [
        "og-title",
        "og-site",
        "og-image",
        "favicon"
    ],

    getLink: function(urlMatch) {
        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template: "embed-html",
            template_context: {
                title: urlMatch[2],
                html: '<script type="text/javascript" src="https://gist.github.com/' + urlMatch[2] +'.js"></script>'
            }
        };
    },

    tests: [{
        page: "https://gist.github.com/discover",
        selector: ".creator a:last"
    },
        "https://gist.github.com/3054754",
        "https://gist.github.com/2719090",
        "https://gist.github.com/schisamo/163c34f3f6335bc12d45",
        "https://gist.github.com/iparamonau/635df38fa737a1d80d23"
    ]
};
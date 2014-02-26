module.exports = {

    re: /^https?:\/\/gist\.github\.com\/(\w+\/)(\w+)/i,

    mixins: [
        "og-site",
        "og-image",
        "favicon"
    ],

    getMeta: function(meta) {        
        return {
            title: (meta.og && meta.og.title) ? meta.og.title : meta["html-title"]
        }
    },

    getLink: function(urlMatch) {
        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.app,
            html: '<script type="text/javascript" src="https://gist.github.com/' + urlMatch[2] +'.js"></script>'
        };
    },

    tests: [{
        page: "https://gist.github.com/discover",
        selector: ".creator a:last"
    }, {
        skipMixins: ["og-image", "og-site"]
    },
        "https://gist.github.com/3054754",
        "https://gist.github.com/2719090",
        "https://gist.github.com/schisamo/163c34f3f6335bc12d45",
        "https://gist.github.com/iparamonau/635df38fa737a1d80d23"
    ]
};
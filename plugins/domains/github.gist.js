module.exports = {

    re: /^https?:\/\/gist\.github\.com\/(\w+\/)(\w+)(#(\w+))?/i,

    mixins: [
        "og-site",
        "og-image",
        "favicon"
    ],

    getMeta: function(meta) {
        return (meta.og && meta.og.title) ? {
            title: meta.og.title,
            description: meta["html-title"]
        } : {
            title: meta["html-title"]
        };
    },

    getLink: function(urlMatch) {
        var scriptUrl;
        if (urlMatch[4]) {
            scriptUrl = 'https://gist.github.com/' + urlMatch[2] +'.js?file=' + urlMatch[4];
        } else {
            scriptUrl = 'https://gist.github.com/' + urlMatch[2] +'.js';

        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.ssl],
            html: '<script type="text/javascript" src="' + scriptUrl + '"></script>'
        };
    },

    tests: [{
        page: "https://gist.github.com/discover",
        selector: ".creator a:nth-child(3)"
    }, {
        skipMixins: ["og-image", "og-site"]
    },
        "https://gist.github.com/3054754",
        "https://gist.github.com/2719090",
        "https://gist.github.com/schisamo/163c34f3f6335bc12d45",
        "https://gist.github.com/iparamonau/635df38fa737a1d80d23",
        "https://gist.github.com/suprememoocow/a26a7cc168a71cc3c69b#file-script-alert-1-script"
    ]
};

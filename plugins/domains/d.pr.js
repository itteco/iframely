module.exports = {

    re: [
        /^https?:\/\/d\.pr\/i\/([a-z0-9]+)/i
    ],

    mixins: [
        "favicon",
        "canonical",
        "og-description",
        "og-title"
    ],

    getMeta: function () {

        return {
            site: "Droplr"
        }

    },

    getLinks: function(urlMatch, meta) {

        return [{
            href: "http://d.pr/i/" + urlMatch[1] + "/medium",
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        }, {
            href: "http://d.pr/i/" + urlMatch[1] + "+",
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }];
    },

    tests: [
        "http://d.pr/i/p6ot"
    ]
};
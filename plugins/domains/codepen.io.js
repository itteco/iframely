module.exports = {

    re: /http:\/\/codepen\.io\/([a-z0-9\-]+)\/(pen|details)\/([a-z0-9\-]+)/i,

    mixins: [
        "twitter-image",
        "favicon",
        "canonical",
        "twitter-description",
        "og-site",
        "twitter-title"
    ],

    getLink: function(urlMatch) {

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline],
            html: '<p data-height="600" data-theme-id="0" data-slug-hash="' + urlMatch[3] + '" data-user="' + urlMatch[1] 
                        + '" data-default-tab="result" class="codepen"></p><script async src="//codepen.io/assets/embed/ei.js"></script>',
            height: 600
        };
    },

    tests: [ {
        pageWithFeed: "http://codepen.io/popular/",
        selector: ".cover-link"
    },
        "http://codepen.io/kevinjannis/pen/pyuix",
        "http://codepen.io/nosecreek/details/sprDl",
        "http://codepen.io/dudleystorey/pen/HrFBx"
    ]

};
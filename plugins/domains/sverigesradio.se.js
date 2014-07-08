module.exports = {

    mixins: [
        "image_src",
        "favicon",
        "twitter-author",
        "canonical",
        "twitter-description",
        "keywords",
        "twitter-title"
    ],

    // The problem is some urls not embedable. Don't know how to detect that.

    getLink: function(url) {
        return {
            href: '//sverigesradio.se/embed?url=' + encodeURIComponent(url),
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            'min-width': 210,
            height: 150
        };
    },

    tests: [
        "http://sverigesradio.se/sida/artikel.aspx?programid=406&artikel=5848335"
    ]
};
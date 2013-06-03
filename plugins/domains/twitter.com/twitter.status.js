module.exports = {

    mixins: [
        "oembed-author",
        "canonical",
        "description",
        "oembed-site",
        "favicon"
    ],

    getLink: function(oembed, meta) {

        var title = meta['html-title'].replace(/Twitter\s*\/?\s*/, "");

        return {
            title: title,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.oembed, CONFIG.R.iframely],
            template_context: {
                title: title,
                html: oembed.html
            },
            width: oembed.width
        }
    }
};
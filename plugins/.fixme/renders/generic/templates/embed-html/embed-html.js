module.exports = {

    getLink: function(title, embed_html) {
        return {
            type: 'text/html',
            template_context: {
                title: title,
                html: embed_html
            },
            width: embed_html.width,
            height: embed_html.height
        }
    }
};
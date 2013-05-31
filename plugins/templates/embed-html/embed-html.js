module.exports = {

    getLink: function(title, embed_html) {
        return {
            type: 'text/html',
            template_context: {
                title: title,
                html: embed_html
            }
        }
    }
};
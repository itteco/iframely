module.exports = {

    getLink: function(title, images) {
        return {
            type: 'text/x-safe-html',
            template_context: {
                title: title,
                images: images
            }
        }
    }
};
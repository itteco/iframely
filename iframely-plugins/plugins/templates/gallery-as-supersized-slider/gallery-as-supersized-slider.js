module.exports = {

    getLink: function(title, images) {
        return {
            type: 'text/html',
            template_context: {
                title: title,
                images: images
            }
        }
    }
};
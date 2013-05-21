module.exports = {

    getMeta: function(oembed) {
        return {
            author: oembed.author_name,
            author_url: oembed.author_url
        };
    }
}
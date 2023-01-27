export default {

    highestPriority: true,

    getMeta: function(oembed) {
        var author = oembed.author_name || oembed.author;

        if (author === 'admin') { // Thanks WordPress
            author = null;
        }

        return {
            author: author,
            author_url: oembed.author_url
        };
    }
}
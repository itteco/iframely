export default {

    highestPriority: true,

    getMeta: function(oembed) {
        return {
            author: oembed.author_name || oembed.author,
            author_url: oembed.author_url
        };
    }
}
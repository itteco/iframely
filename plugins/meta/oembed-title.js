export default {

    // avoid wordpress pages
    lowestPriority: true,

    getMeta: function(oembed) {
        return {
            title: oembed.title
        };
    }
};
module.exports = {

    useAlways: true,

    getMeta: function(meta) {
        return {
            date: meta.og.article.published_time || meta.og.article.modified_time
        };
    }
};
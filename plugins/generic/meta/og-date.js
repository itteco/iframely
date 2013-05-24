module.exports = {

    useAlways: true,

    getMeta: function(meta) {

        if (!meta.og || !meta.og.article)
            return;

        return {
            date: meta.og.article.published_time || meta.og.article.modified_time
        };
    }
};
module.exports = {

    getMeta: function(meta) {

        var date = meta.date || meta.pubdate || meta.lastmod || (meta.article && meta.article.published_time);

        // Can be multiple dates.
        if (date && date instanceof Array) {
            date = date[0];
        }

        return {
            date: date
        };
    }
};
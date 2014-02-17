module.exports = {

    getMeta: function(og) {

        if (!og.article)
            return;

        return {
            date: og.article.published_time || og.article.modified_time
        };
    }
};
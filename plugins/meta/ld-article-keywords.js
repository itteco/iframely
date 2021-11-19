module.exports = {

    getMeta: function(ld) {

        if (ld.newsarticle && ld.newsarticle.keywords && ld.newsarticle.keywords instanceof Array) {
            return {
                keywords: ld.newsarticle.keywords.join(', ')
            }
        }
    }
};
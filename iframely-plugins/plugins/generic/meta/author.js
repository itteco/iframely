module.exports = {

    useAlways: true,

    lowestPriority: true,

    getMeta: function(meta) {

        function getAuthor(value) {
            if (typeof value === "string") {
                if (/^https?:\/\//i.test(value)) {
                    return {
                        author_url: value
                    };
                } else {
                    return {
                        author: value
                    };
                }

            }
        }

        var result = getAuthor(meta.author);

        if (!result) {
            result = getAuthor(meta.article.author);
        }

        return result;
    }
};
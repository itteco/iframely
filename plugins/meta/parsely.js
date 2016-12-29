module.exports = {

    highestPriority: true,

    provides: 'self',

    getData: function(meta) {

        var p = meta["parsely-page"] || meta["parsely-metadata"];
        if (p) {
            try {

                var data = JSON.parse(p);

                return {
                    parsely: data
                };

            } catch(ex) {
            }
        }
    },

    getMeta: function(parsely) {

        return {
            title: parsely.title,
            date: parsely.pub_date,
            description: parsely.summary,
            author: parsely.author,
            keywords: parsely.tags && parsely.tags instanceof Array ? parsely.tags.join(', ') : null,
            category: parsely.section            
        };
    }
};
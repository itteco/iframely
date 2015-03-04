module.exports = {

    highestPriority: true,

    provides: 'self',

    getData: function(meta) {

        var p = meta["parsely-page"];
        if (p) {
            try {

                var data = JSON.parse(p);

                return {
                    parsely_page: data
                };

            } catch(ex) {
            }
        }
    },

    getMeta: function(parsely_page) {

        return {
            title: parsely_page.title,
            date: parsely_page.pub_date,
            author: parsely_page.author,
            keywords: parsely_page.tags && parsely_page.tags instanceof Array ? parsely_page.tags.join(', ') : null,
            category: parsely_page.section,
            media: parsely_page.type == "post" ? 'reader': null
        };
    }
};
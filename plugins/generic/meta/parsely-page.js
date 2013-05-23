module.exports = {

    lowestPriority: true,

    getMeta: function(meta) {
        var p = meta["parsely-page"]
        if (p) {
            try {

                var data = JSON.parse(p);

                return {
                    title: data.title,
                    date: data.pub_date,
                    author: data.author,
                    keywords: data.tags && data.tags.join(', ')
                };

            } catch(ex) {
            }
        }
    },

    getLink: function(meta) {
        var p = meta["parsely-page"]
        if (p) {
            try {

                var data = JSON.parse(p);

                if (data.image_url) {
                    return {
                        href: data.image_url,
                        type: CONFIG.T.image,
                        rel: CONFIG.R.thumbnail
                    };
                }

            } catch(ex) {
            }
        }
    }
};
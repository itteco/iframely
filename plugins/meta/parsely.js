export default {

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

        } else if (meta["parsely-title"]) {

            var key, data = {};

            for(key in meta) {
                if (key.indexOf('parsely-') === 0) {
                    var p_key = key.substring(8);
                    data[p_key] = meta[key];
                }
            }

            return {
                parsely: data
            };
        }
    },

    getMeta: function(parsely) {

        return {
            title: parsely.title,
            date: parsely.pub_date || parsely["pub-date"],
            description: parsely.summary,
            author: parsely.author,
            keywords: parsely.tags && parsely.tags instanceof Array ? parsely.tags.join(', ') : null,
            category: parsely.section            
        };
    }
};
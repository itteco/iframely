import * as URL from "url"

export default {

    provides: 'query',

    getData: function(url) {

        if (/\?/i.test(url)) {
            var query = URL.parse(url, true).query;
            // validate and apply boolean 
            for (const key in query) {
                if (query[key] === "true") {
                    query[key] = true;
                } else if (query[key] === "false") {
                    query[key] = false;
                } else if (/^\d+$/.test(query[key])) {
                    try {
                        query[key] = parseInt(query[key]);
                    } catch (ex) {}
                }
            }
            return {
                query: query
            };
        } else {
            return {query: {}}
        }
    }
}
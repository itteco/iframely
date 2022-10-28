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
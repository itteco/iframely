import * as URL from "url"

export default {

    provides: 'query',

    getData: function(url) {

        if (/\?/i.test(url)) {
            var query = URL.parse(url, true).query;
            var query_ = query['_'];

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

                // Put all _... parameters into a "_" object
                if (key.startsWith('_') && !query_) {
                    if (!query['_']) {
                        query['_'] = {}
                    }
                    query._[key.replace("_", "")] = query[key]
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
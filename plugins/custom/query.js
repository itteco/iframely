import * as URL from "url"

export default {

    provides: 'query',

    getData: function(url) {

        if (/\?/i.test(url)) {
            return {
                query: URL.parse(url, true).query
            };
        } else {
            return {query: {}}
        }
    }
}
export default {

    provides: "headers",

    getData: function(htmlparser, __noCachedMeta, cb) {
        // Use `htmlparser` if no meta cache.
        if (htmlparser.headers) {
            return cb (null, {
                headers: htmlparser.headers
            })
        } else {
            cb();
        }
    }
};
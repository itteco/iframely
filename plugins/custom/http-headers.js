module.exports = {

    provides: "headers",

    getData: function(htmlparser, cb) {

        if (htmlparser.request && htmlparser.request.response && htmlparser.request.response.headers) {
            return cb (null, {
                headers: htmlparser.request.response.headers
            })
        } else {
            cb();
        }
    }
};
module.exports = {

    provides: "headers",

    getData: function(htmlparser, cb) {

        if (htmlparser.headers) {
            return cb (null, {
                headers: htmlparser.headers
            })
        } else {
            cb();
        }
    }
};
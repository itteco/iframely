module.exports = {

    re: /^http:\/\/habrahabr\.ru\//,

    getData: function(htmlparser, cb) {

        htmlparser.addHandler({
            onend: function() {
                cb(null, {
                    habr_data: true
                });
            }
        });
    }
};
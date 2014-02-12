module.exports = {

    re: /^http:\/\/habrahabr\.ru\/222/,

    getData: function(htmlparser, cb) {

        cb();/*
        htmlparser.addHandler({
            onend: function() {
                cb(null, {
                    habr_data: true
                });
            }
        });
        */
    }
};
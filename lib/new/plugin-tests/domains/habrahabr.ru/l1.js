module.exports = {

    re: /^http:\/\/habrahabr\.ru\//,

    getData: function(og, twitter, cb) {

        cb(null, {
            title: 'ok'
        });
/*
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
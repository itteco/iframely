module.exports = {

    re: /^http:\/\/habrahabr\.ru\//,

    getData: function(readability, cb) {
        setTimeout(function() {
            cb(null, {
                html: !!readability.getHTML(),
                habr_data: true
            });
        }, 2000);
    }
};
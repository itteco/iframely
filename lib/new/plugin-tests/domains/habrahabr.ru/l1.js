module.exports = {

    re: /^http:\/\/habrahabr\.ru\//,

    getData: function(og, twitter, cb) {

        setTimeout(function() {
            cb(null, {
                title: 'ok'
            });
        }, 500);
/*
        htmlparser.addHandler({
            onend: function() {
                cb(null, {
                    habr_data: true
                });
            }
        });
        */
    },

    getLink: function(og) {

        var r = [{
            href: 'http://habrahabr.ru/favicon.ico',
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        }];
        og.image.forEach(function(img) {
            r.push({
                href: img,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
            });
        });

        return r;
    }
};
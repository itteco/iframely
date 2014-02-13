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
    },

    getLink: function() {
        return [{
            href: 'http://habrastorage.org/getpro/habr/post_images/593/ab6/704/593ab6704dad3179020756f418795435.jpg',
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }, {
            href: 'https://habrastorage.org/getpro/habr/post_images/593/ab6/704/593ab6704dad3179020756f418795435.jpg',
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }]
    }
};
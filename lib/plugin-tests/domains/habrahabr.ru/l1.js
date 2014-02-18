module.exports = {

    re: /^http:\/\/habrahabr\.ru\//,

    getMeta: function(meta) {

        return {
            title: meta['html-title']
        };
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
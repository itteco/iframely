module.exports = {

    getData: function(url, meta, cb) {

        return cb(meta.robots && /noindex/i.test(meta.robots) && !meta.description && !meta.og && !meta.twitter
            ? {
               responseStatusCode: 403,
               message: "The robots directive of this page prevents Iframely from parsing it"
            } : null);
    }

};
module.exports = {

    getData: function(url, meta, cb) {

        return cb(meta.robots && /noindex/i.test(meta.robots) && !meta.description && !meta.og && !meta.twitter
            ? {
               responseStatusCode: 403
            } : null);
    }

};
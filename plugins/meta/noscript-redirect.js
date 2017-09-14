module.exports = {

    getData: function(url, meta, cb) {

        return cb((meta.refresh && ((!meta.description && !meta.og && !meta.twitter) || /re\-?direct/i.test(meta['html-title']))) 
            ? {
               redirect: meta.refresh
            } : null);
    }

};
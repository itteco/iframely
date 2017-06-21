module.exports = {

    getData: function(url, meta, cb) {

        return cb((meta.refresh && (!meta['html-title'] || meta['html-title'] === '' || !meta.title || /re\-?direct/i.test(meta['html-title']))) 
            ? {
                redirect: meta.refresh
            } : null);
    }

};
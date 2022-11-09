export default {

    getData: function(url, meta, cb) {
        return cb(
            meta.refresh 
            && (!meta.description 
                    && (!meta.og || !meta.og.title || !meta.og.description) 
                    && (!meta.twitter || !meta.twitter.title || !meta.twitter.description)
                || /re\-?direct/i.test(meta['html-title'])
                || /^https?:\/\/[^\/]+\/(?:log_?in|sign_?in|sign_?up)/i.test(meta.refresh)) 
            ? {
               redirect: meta.refresh
            } : null);
    }
};
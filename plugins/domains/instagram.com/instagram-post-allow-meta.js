export default {

    re: 'instagram.com',

    provides: 'ipOG',

    getData: function(__allowInstagramMeta, meta, cb) {
        if (!meta.og && !meta.twitter && !meta.ld 
            && !meta.title && !meta.description 
            && meta['html-title'] === 'Instagram') {
            return cb({responseStatusCode: 404})
        } else {
            return cb (null, {
                ipOG: meta.og ? meta.og : {}
            })
        }
    }
};
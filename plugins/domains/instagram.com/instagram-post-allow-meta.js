export default {

    re: 'instagram.com',

    provides: 'ipOG',

    getData: function(__allowInstagramMeta, meta, cb) {
        if (!meta.og && !meta.twitter && !meta.ld 
            && !meta.title && !meta.description 
            && meta['html-title'] === 'Instagram') {
            return cb({responseStatusCode: 404})

        } else if (
            // URL from instagram-profile
            /^https?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9\._]+)\/?(?:\?.*)?$/i.test(meta.og?.url)
            && meta.og?.type === 'profile') {
            return cb({responseStatusCode: 403})

        } else {
            return cb (null, {
                ipOG: meta.og ? meta.og : {}
            })
        }
    }

    // private: https://www.instagram.com/tv/Cfv5RV6Ae8bMan9o-CS7vsZGxcmGHuTGvG0jNI0/?igsh=bmI4czZqb2l4NDQx
    // deleted: https://www.instagram.com/p/B3A-0uuAhg0/
};
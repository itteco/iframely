export default {

    re: 'instagram.com',

    provides: 'ipOG',

    getData: function(__allowInstagramMeta, meta) {
        return {
            ipOG: meta.og ? meta.og : {}
        }
    }
};